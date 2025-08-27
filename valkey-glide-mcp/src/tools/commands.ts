import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { promises as fs } from "node:fs";

type ParsedMethod = {
  name: string;
  paramsSignature: string;
  returnType: string | null;
};

type CommandEntry = {
  command: string;
  family: string;
  method: string | null;
  paramsSignature: string | null;
  returnType: string | null;
  source: "wiki";
  validated: boolean;
  notes?: string;
};

const FAMILIES: Record<string, string> = {
  // Family mapping by command prefixes
  GET: "strings",
  SET: "strings",
  MGET: "strings",
  MSET: "strings",
  INCR: "strings",
  DECR: "strings",
  APPEND: "strings",
  STRLEN: "strings",
  GETBIT: "bitmaps",
  SETBIT: "bitmaps",
  BITCOUNT: "bitmaps",
  BITFIELD: "bitmaps",
  BITFIELD_RO: "bitmaps",
  BITPOS: "bitmaps",
  DEL: "keys",
  EXISTS: "keys",
  EXPIRE: "keys",
  PEXPIRE: "keys",
  EXPIREAT: "keys",
  PEXPIREAT: "keys",
  TTL: "keys",
  PTTL: "keys",
  DUMP: "keys",
  RESTORE: "keys",
  PERSIST: "keys",
  TOUCH: "keys",
  TYPE: "keys",
  UNLINK: "keys",
  RENAME: "keys",
  RENAMENX: "keys",
  HSET: "hashes",
  HGET: "hashes",
  HDEL: "hashes",
  HINCRBY: "hashes",
  HINCRBYFLOAT: "hashes",
  HGETALL: "hashes",
  HSTRLEN: "hashes",
  HEXISTS: "hashes",
  HLEN: "hashes",
  HKEYS: "hashes",
  HVALS: "hashes",
  HMGET: "hashes",
  HRANDFIELD: "hashes",
  LPUSH: "lists",
  RPUSH: "lists",
  LPOP: "lists",
  RPOP: "lists",
  LINDEX: "lists",
  LINSERT: "lists",
  LLEN: "lists",
  LPOS: "lists",
  LRANGE: "lists",
  LREM: "lists",
  LSET: "lists",
  LTRIM: "lists",
  BLPOP: "lists",
  BRPOP: "lists",
  LMPOP: "lists",
  BLMPop: "lists",
  SADD: "sets",
  SCARD: "sets",
  SDIFF: "sets",
  SDIFFSTORE: "sets",
  SINTER: "sets",
  SINTERSTORE: "sets",
  SUNION: "sets",
  SUNIONSTORE: "sets",
  SREM: "sets",
  SMEMBERS: "sets",
  SISMEMBER: "sets",
  SMISMEMBER: "sets",
  SRANDMEMBER: "sets",
  SPOP: "sets",
  ZADD: "zsets",
  ZCARD: "zsets",
  ZCOUNT: "zsets",
  ZLEXCOUNT: "zsets",
  ZINTER: "zsets",
  ZUNION: "zsets",
  ZINTERCARD: "zsets",
  ZRANGE: "zsets",
  ZRANGESTORE: "zsets",
  ZREM: "zsets",
  ZREMRANGEBYSCORE: "zsets",
  ZREMRANGEBYRANK: "zsets",
  ZREMRANGEBYLEX: "zsets",
  ZSCORE: "zsets",
  ZRANK: "zsets",
  ZREVRANK: "zsets",
  ZMSCORE: "zsets",
  ZRANDMEMBER: "zsets",
  ZPOPmax: "zsets",
  ZPOPmin: "zsets",
  GEOADD: "geo",
  GEOSEARCH: "geo",
  GEOSEARCHSTORE: "geo",
  GEODIST: "geo",
  GEOPOS: "geo",
  GEOHASH: "geo",
  XADD: "streams",
  XDEL: "streams",
  XRANGE: "streams",
  XREVRANGE: "streams",
  XLEN: "streams",
  XGROUP: "streams",
  XPENDING: "streams",
  XREAD: "streams",
  XREADGROUP: "streams",
  XACK: "streams",
  XCLAIM: "streams",
  XAUTOCLAIM: "streams",
  PUBLISH: "pubsub",
  ECHO: "server",
  PING: "server",
  INFO: "server",
  TIME: "server",
  CLIENT: "server",
  FUNCTION: "functions",
  FCALL: "functions",
  SCRIPT: "scripts",
  FCALL_RO: "functions",
};

function mapCommandToMethod(command: string): string | null {
  // Normalize cases where wiki lists multi-word commands
  const cmd = command.replace(/\s+/g, " ").trim();
  const base = cmd.replace(/[^A-Z_ ]/g, "");
  const simple = base.replace(/\s+/g, "");
  // Special mappings
  const specials: Record<string, string> = {
    BITFIELD_RO: "bitfieldReadOnly",
    ZRANGESTORE: "zrangeStore",
    ZRANGE_WITHSCORES: "zrangeWithScores",
    ZRANK_WITHSCORE: "zrankWithScore",
    ZREVRANK_WITHSCORE: "zrevrankWithScore",
    XRANGE: "xrange",
    XREVRANGE: "xrevrange",
    XREADGROUP: "xreadgroup",
    XREAD: "xread",
    XGROUP_CREATE: "xgroupCreate",
    XGROUP_DESTROY: "xgroupDestroy",
    XGROUP_DELCONSUMER: "xgroupDelConsumer",
    XGROUP_CREATECONSUMER: "xgroupCreateConsumer",
    XGROUP_SETID: "xgroupSetId",
    GEOSEARCHSTORE: "geosearchstore",
    GEODIST: "geodist",
  };
  if (specials[simple]) return specials[simple];
  // Default mapping: uppercase to lowercase
  return simple.toLowerCase();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed ${url}: ${res.status}`);
  return await res.text();
}

function extractWikiCommands(html: string): string[] {
  const commands = new Set<string>();
  const codeTagRe = /<code>([A-Z][A-Z0-9_\s]{1,})<\/code>/g;
  let m: RegExpExecArray | null;
  while ((m = codeTagRe.exec(html))) {
    const token = m[1].trim();
    if (/^[A-Z][A-Z0-9_\s]{1,}$/.test(token)) {
      // Heuristic: ignore very long or non-command tokens
      if (token.length <= 40) commands.add(token);
    }
  }
  return Array.from(commands);
}

function extractPublicMethods(ts: string): ParsedMethod[] {
  const lines = ts.split(/\n/);
  const out: ParsedMethod[] = [];
  const sigRe = /public\s+async\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*:\s*Promise<([^>]+)>/;
  for (const line of lines) {
    const m = sigRe.exec(line);
    if (m) {
      out.push({ name: m[1], paramsSignature: m[2].trim(), returnType: m[3].trim() });
    }
  }
  return out;
}

function pickFamily(command: string): string {
  const key = command.split(" ")[0].toUpperCase();
  return FAMILIES[key] ?? "other";
}

export function registerCommandsTools(mcp: McpServer) {
  mcp.tool(
    "commands.ingest",
    z
      .object({ start: z.number().int().min(0).default(0), count: z.number().int().min(1).max(20).default(10), refresh: z.boolean().optional() })
      .shape,
    async (args) => {
      const wikiUrl = "https://github.com/valkey-io/valkey-glide/wiki/ValKey-Commands-Implementation-Progress";
      const baseClientUrl = "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/BaseClient.ts";
      const html = await fetchText(wikiUrl);
      const ts = await fetchText(baseClientUrl);
      const wikiCommands = extractWikiCommands(html).sort();
      const methods = extractPublicMethods(ts);
      const nameToMethod = new Map(methods.map((m) => [m.name.toLowerCase(), m]));

      const slice = wikiCommands.slice(args.start, args.start + args.count);
      const enriched: CommandEntry[] = slice.map((cmd) => {
        const methodName = mapCommandToMethod(cmd);
        const m = methodName ? nameToMethod.get(methodName.toLowerCase()) : undefined;
        return {
          command: cmd,
          family: pickFamily(cmd),
          method: m ? m.name : null,
          paramsSignature: m ? m.paramsSignature : null,
          returnType: m ? m.returnType : null,
          source: "wiki",
          validated: !!m,
          notes: !m ? "No matching method found in BaseClient" : undefined,
        };
      });

      const outDir = new URL("../../..", import.meta.url).pathname;
      const outPath = `${outDir}/COMMANDS_INDEX.json`;
      let existing: { entries: CommandEntry[] } = { entries: [] };
      try {
        if (!args.refresh) {
          const raw = await fs.readFile(outPath, "utf8");
          existing = JSON.parse(raw);
        }
      } catch {}
      // Merge by command
      const byCommand = new Map<string, CommandEntry>();
      for (const e of existing.entries) byCommand.set(e.command, e);
      for (const e of enriched) byCommand.set(e.command, e);
      const merged = { entries: Array.from(byCommand.values()).sort((a, b) => a.command.localeCompare(b.command)) };
      await fs.writeFile(outPath, JSON.stringify(merged, null, 2), "utf8");

      // Group by family for assistant-friendly listing
      const byFamily: Record<string, CommandEntry[]> = {};
      for (const e of merged.entries) {
        (byFamily[e.family] ??= []).push(e);
      }
      await fs.writeFile(`${outDir}/COMMANDS_BY_FAMILY.json`, JSON.stringify(byFamily, null, 2), "utf8");

      return {
        structuredContent: { total: wikiCommands.length, processed: enriched.length, start: args.start, count: args.count, validated: enriched.filter((e) => e.validated).length },
        content: [{ type: "text", text: `Processed ${args.count} commands starting at ${args.start}. Validated ${enriched.filter((e) => e.validated).length}/${enriched.length}. Written COMMANDS_INDEX.json.` }],
      } as any;
    }
  );

  mcp.tool(
    "commands.listFamilies",
    z.object({}).shape,
    async () => {
      const outDir = new URL("../../..", import.meta.url).pathname;
      const raw = await fs.readFile(`${outDir}/COMMANDS_BY_FAMILY.json`, "utf8");
      const data = JSON.parse(raw) as Record<string, CommandEntry[]>;
      const families = Object.keys(data).sort();
      return { structuredContent: { families }, content: [{ type: "text", text: JSON.stringify(families) }] } as any;
    }
  );

  mcp.tool(
    "commands.getByFamily",
    z.object({ family: z.string() }).shape,
    async (args) => {
      const outDir = new URL("../../..", import.meta.url).pathname;
      const raw = await fs.readFile(`${outDir}/COMMANDS_BY_FAMILY.json`, "utf8");
      const data = JSON.parse(raw) as Record<string, CommandEntry[]>;
      const entries = data[args.family] ?? [];
      return { structuredContent: { family: args.family, entries }, content: [{ type: "text", text: JSON.stringify(entries.slice(0, 20), null, 2) }] } as any;
    }
  );
}


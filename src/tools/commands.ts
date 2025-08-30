import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { promises as fs } from "node:fs";

type ParsedMethod = {
  name: string;
  paramsSignature: string;
  returnType: string | null;
  owner: string; // BaseClient | GlideClient | GlideClusterClient | GlideJson
};

type CommandEntry = {
  command: string;
  family: string;
  method: string | null;
  owner?: string | null;
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
    XGROUPCREATE: "xgroupCreate",
    XGROUP_DESTROY: "xgroupDestroy",
    XGROUPDESTROY: "xgroupDestroy",
    XGROUP_DELCONSUMER: "xgroupDelConsumer",
    XGROUPDELCONSUMER: "xgroupDelConsumer",
    XGROUP_CREATECONSUMER: "xgroupCreateConsumer",
    XGROUPCREATECONSUMER: "xgroupCreateConsumer",
    XGROUP_SETID: "xgroupSetId",
    XGROUPSETID: "xgroupSetId",
    GEOSEARCHSTORE: "geosearchstore",
    GEODIST: "geodist",
    CLIENTGETNAME: "clientGetName",
    CLIENTID: "clientId",
    CONFIGGET: "configGet",
    CONFIGSET: "configSet",
    CONFIGREWRITE: "configRewrite",
    CONFIGRESETSTAT: "configResetStat",
    DBSIZE: "dbsize",
    RANDOMKEY: "randomKey",
    SCRIPTEXISTS: "scriptExists",
    SCRIPTFLUSH: "scriptFlush",
    SCRIPTKILL: "scriptKill",
    SCRIPTSHOW: "scriptShow",
    FUNCTIONLIST: "functionList",
    FUNCTIONLOAD: "functionLoad",
    FUNCTIONRESTORE: "functionRestore",
    FUNCTIONFLUSH: "functionFlush",
    FUNCTIONKILL: "functionKill",
    FUNCTIONDELETE: "functionDelete",
    FUNCTIONSTATS: "functionStats",
    PUBSUBCHANNELS: "pubsubChannels",
    PUBSUBNUMPAT: "pubsubNumPat",
    PUBSUBNUMSUB: "pubsubNumSub",
    PUBSUBSHARDCHANNELS: "pubsubShardChannels",
    PUBSUBSHARDNUMSUB: "pubsubShardNumSub",
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

function extractWikiCommandsHtml(html: string): string[] {
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

function extractWikiCommandsMarkdown(md: string): string[] {
  const commands: string[] = [];
  const lines = md.split(/\n/);
  for (const line of lines) {
    const m = /^\|\s*([^|]+?)\s*\|/.exec(line);
    if (!m) continue;
    const cmdRaw = m[1].trim();
    if (!cmdRaw) continue;
    const lc = cmdRaw.toLowerCase();
    if (
      lc.includes("n/a") ||
      lc.includes("api not required") ||
      lc.includes("deprecated") ||
      lc.includes("not needed") ||
      lc === "cmd type" ||
      /^-+$/.test(cmdRaw)
    )
      continue;
    // Normalize to upper snake-ish without extra spaces
    const normalized = cmdRaw.replace(/\s+/g, " ").trim().toUpperCase();
    commands.push(normalized);
  }
  return Array.from(new Set(commands));
}

function extractPublicMethods(ts: string, owner: string): ParsedMethod[] {
  const lines = ts.split(/\n/);
  const out: ParsedMethod[] = [];
  const res = ts.matchAll(
    /(?:public\s+)?(?:static\s+)?async\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*:\s*Promise<([^>]+)>/g,
  );
  for (const m of res) {
    out.push({
      name: String(m[1]),
      paramsSignature: String(m[2]).trim(),
      returnType: String(m[3]).trim(),
      owner,
    });
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
    "Ingest and validate Valkey commands from documentation",
    {
      start: z.number().int().min(0).default(0),
      count: z.number().int().min(1).max(20).default(10),
      refresh: z.boolean().optional(),
      sources: z
        .object({
          md: z.string().optional(),
          tsBase: z.string().optional(),
          tsClient: z.string().optional(),
          tsCluster: z.string().optional(),
          tsJson: z.string().optional(),
        })
        .optional(),
    },
    async ({ start = 0, count = 10, refresh, sources }) => {
      const mdUrl =
        "https://raw.githubusercontent.com/wiki/valkey-io/valkey-glide/ValKey-Commands-Implementation-Progress.md";
      const htmlUrl =
        "https://github.com/valkey-io/valkey-glide/wiki/ValKey-Commands-Implementation-Progress";
      const baseClientUrl =
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/BaseClient.ts";
      const glideClientUrl =
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/GlideClient.ts";
      const glideClusterUrl =
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/GlideClusterClient.ts";
      const glideJsonUrl =
        "https://raw.githubusercontent.com/valkey-io/valkey-glide/main/node/src/server-modules/GlideJson.ts";

      const md = sources?.md ?? (await fetchText(mdUrl));
      const wikiCommands = extractWikiCommandsMarkdown(md).sort();
      if (wikiCommands.length === 0) {
        const html = await fetchText(htmlUrl);
        wikiCommands.push(...extractWikiCommandsHtml(html));
      }

      const [tsBase, tsClient, tsCluster, tsJson] = await Promise.all([
        sources?.tsBase ?? fetchText(baseClientUrl),
        sources?.tsClient ?? fetchText(glideClientUrl),
        sources?.tsCluster ?? fetchText(glideClusterUrl),
        sources?.tsJson ?? fetchText(glideJsonUrl),
      ]);
      const methods = [
        ...extractPublicMethods(tsBase, "BaseClient"),
        ...extractPublicMethods(tsClient, "GlideClient"),
        ...extractPublicMethods(tsCluster, "GlideClusterClient"),
        ...extractPublicMethods(tsJson, "GlideJson"),
      ];
      const nameToMethod = new Map(
        methods.map((m) => [m.name.toLowerCase(), m]),
      );

      const slice = wikiCommands.slice(start, start + count);
      const enriched: CommandEntry[] = slice.map((cmd) => {
        const methodName = mapCommandToMethod(cmd);
        const m = methodName
          ? nameToMethod.get(methodName.toLowerCase())
          : undefined;
        return {
          command: cmd,
          family: pickFamily(cmd),
          method: m
            ? m.owner && m.owner !== "BaseClient"
              ? `${m.owner}.${m.name}`
              : m.name
            : null,
          owner: m ? m.owner : null,
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
        if (!refresh) {
          const raw = await fs.readFile(outPath, "utf8");
          existing = JSON.parse(raw);
        }
      } catch {}
      // Merge by command
      const byCommand = new Map<string, CommandEntry>();
      for (const e of existing.entries) byCommand.set(e.command, e);
      for (const e of enriched) byCommand.set(e.command, e);
      const merged = {
        entries: Array.from(byCommand.values()).sort((a, b) =>
          a.command.localeCompare(b.command),
        ),
      };
      await fs.writeFile(outPath, JSON.stringify(merged, null, 2), "utf8");

      // Group by family for assistant-friendly listing
      const byFamily: Record<string, CommandEntry[]> = {};
      for (const e of merged.entries) {
        (byFamily[e.family] ??= []).push(e);
      }
      await fs.writeFile(
        `${outDir}/COMMANDS_BY_FAMILY.json`,
        JSON.stringify(byFamily, null, 2),
        "utf8",
      );

      return {
        content: [
          {
            type: "text",
            text: `Processed ${count} commands starting at ${start}. Validated ${enriched.filter((e) => e.validated).length}/${enriched.length}. Written COMMANDS_INDEX.json.`,
          },
        ],
        structuredContent: {
          processedCount: count,
          processed: enriched.length,  // Add backward compatibility
          startIndex: start,
          validatedCount: enriched.filter((e) => e.validated).length,
          totalProcessed: enriched.length,
          commands: enriched
        },
      };
    },
  );

  mcp.tool(
    "commands.listFamilies",
    "Get all available command families",
    {},
    async () => {
      const outDir = new URL("../../..", import.meta.url).pathname;
      const raw = await fs.readFile(`${outDir}/COMMANDS_BY_FAMILY.json`, "utf8");
      const data = JSON.parse(raw) as Record<string, CommandEntry[]>;
      const families = Object.keys(data).sort();
      return {
        content: [{ type: "text", text: JSON.stringify(families) }],
        structuredContent: { families },
      };
    },
  );

  mcp.tool(
    "commands.getByFamily",
    "Get all commands in a specific family",
    {
      family: z.string(),
    },
    async ({ family }) => {
      const outDir = new URL("../../..", import.meta.url).pathname;
      const raw = await fs.readFile(
        `${outDir}/COMMANDS_BY_FAMILY.json`,
        "utf8",
      );
      const data = JSON.parse(raw) as Record<string, CommandEntry[]>;
      const entries = data[family] ?? [];
      return {
        content: [
          { type: "text", text: JSON.stringify(entries.slice(0, 20), null, 2) },
        ],
        structuredContent: { family, entries, totalCount: entries.length },
      };
    },
  );
}

/**
 * Smart Migration Engine - Consolidates migration functionality
 * Replaces: migrate.ts and related migration tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRoutingContext } from "../routing/context-analyzer.js";
import { SmartTool } from "../routing/tool-router.js";

export class SmartMigrationEngine implements SmartTool {
  name = "migration-engine";
  capabilities = ["migrate", "transform", "convert", "analyze"];
  complexity = 5;

  supports(context: ToolRoutingContext): boolean {
    return (
      context.userIntent === "migration" || context.taskType === "transform"
    );
  }

  async execute(args: any, context: ToolRoutingContext): Promise<any> {
    if (!args || !args.code || !args.from) {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: Missing required parameters 'code' and 'from'",
          },
          {
            type: "text",
            text: "Usage: { code: 'your-code', from: 'ioredis' | 'node-redis' }",
          },
        ],
      };
    }

    const { code, from } = args;

    if (from !== "ioredis" && from !== "node-redis") {
      return {
        content: [
          {
            type: "text",
            text: "❌ Error: 'from' must be 'ioredis' or 'node-redis'",
          },
        ],
      };
    }

    // Analyze the code complexity
    const complexity = this.assessCodeComplexity(code);
    const patterns = this.detectMigrationPatterns(code);

    // Choose migration strategy based on complexity
    let transformedCode: string;
    let warnings: string[] = [];
    let notes: string[] = [];

    if (complexity === "simple" && patterns.length === 0) {
      transformedCode = this.naiveMigration(code, from);
    } else if (patterns.includes("cluster")) {
      const result = this.clusterMigration(code, from);
      transformedCode = result.code;
      warnings = result.warnings;
      notes = result.notes;
    } else if (
      patterns.includes("pipeline") ||
      patterns.includes("transaction")
    ) {
      const result = this.transactionMigration(code, from);
      transformedCode = result.code;
      warnings = result.warnings;
      notes = result.notes;
    } else {
      const result = this.advancedMigration(code, from, patterns);
      transformedCode = result.code;
      warnings = result.warnings;
      notes = result.notes;
    }

    // Prepare response
    const response = [
      { type: "text", text: `✅ Migration from ${from} to GLIDE completed!` },
      {
        type: "text",
        text: `Detected patterns: ${patterns.join(", ") || "basic operations"}`,
      },
      { type: "text", text: `Complexity: ${complexity}` },
    ];

    if (warnings.length > 0) {
      response.push({
        type: "text",
        text: `⚠️ Warnings:\n${warnings.map((w) => `  • ${w}`).join("\n")}`,
      });
    }

    if (notes.length > 0) {
      response.push({
        type: "text",
        text: `📝 Notes:\n${notes.map((n) => `  • ${n}`).join("\n")}`,
      });
    }

    response.push({ type: "text", text: "🔄 Transformed code:" });
    response.push({ type: "text", text: transformedCode });

    return { content: response };
  }

  private assessCodeComplexity(
    code: string,
  ): "simple" | "intermediate" | "advanced" {
    const advancedPatterns = [
      "cluster",
      "pipeline",
      "multi",
      "exec",
      "watch",
      "eval",
      "evalsha",
    ];
    const intermediatePatterns = [
      "transaction",
      "batch",
      "pub",
      "sub",
      "stream",
    ];

    const hasAdvanced = advancedPatterns.some((pattern) =>
      code.toLowerCase().includes(pattern),
    );

    const hasIntermediate = intermediatePatterns.some((pattern) =>
      code.toLowerCase().includes(pattern),
    );

    if (hasAdvanced) return "advanced";
    if (hasIntermediate) return "intermediate";
    return "simple";
  }

  private detectMigrationPatterns(code: string): string[] {
    const patterns: string[] = [];
    const lowerCode = code.toLowerCase();

    // Connection patterns
    if (lowerCode.includes("cluster")) patterns.push("cluster");
    if (lowerCode.includes("sentinel")) patterns.push("sentinel");

    // Operation patterns
    if (lowerCode.includes("pipeline")) patterns.push("pipeline");
    if (lowerCode.includes("multi") || lowerCode.includes("exec"))
      patterns.push("transaction");
    if (lowerCode.includes("eval") || lowerCode.includes("evalsha"))
      patterns.push("lua");
    if (lowerCode.includes("pub") || lowerCode.includes("sub"))
      patterns.push("pubsub");
    if (lowerCode.includes("stream") || lowerCode.includes("xadd"))
      patterns.push("streams");
    if (lowerCode.includes("scan") || lowerCode.includes("sscan"))
      patterns.push("scan");

    // Advanced features
    if (lowerCode.includes("watch") || lowerCode.includes("unwatch"))
      patterns.push("optimistic-locking");
    if (lowerCode.includes("blocking") || lowerCode.includes("blpop"))
      patterns.push("blocking");

    return patterns;
  }

  private naiveMigration(code: string, from: string): string {
    let transformed = code;

    if (from === "ioredis") {
      transformed = this.applyIoredisTransformations(transformed);
    } else if (from === "node-redis") {
      transformed = this.applyNodeRedisTransformations(transformed);
    }

    // Also apply common transformations for parity on simple cases
    transformed = this.applyCommonTransformations(transformed);
    return transformed;
  }

  private clusterMigration(
    code: string,
    from: string,
  ): { code: string; warnings: string[]; notes: string[] } {
    let transformed = code;
    const warnings: string[] = [];
    const notes: string[] = [];

    if (from === "ioredis") {
      // Replace Redis.Cluster with GlideClusterClient
      transformed = transformed.replace(
        /new\s+Redis\.Cluster\s*\(\s*\[([^\]]+)\]\s*\)/g,
        (match, nodes) => {
          notes.push("Converted Redis.Cluster to GlideClusterClient");
          return `await GlideClusterClient.createClient({\n  addresses: ${nodes}\n})`;
        },
      );

      // Replace import
      transformed = transformed.replace(
        /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
        "import { GlideClusterClient } from '@valkey/valkey-glide';",
      );

      warnings.push(
        "Cluster failover behavior may differ between ioredis and GLIDE",
      );
      notes.push(
        "Review cluster connection configuration for GLIDE-specific options",
      );
    }

    // Apply common transformations
    transformed = this.applyCommonTransformations(transformed);

    return { code: transformed, warnings, notes };
  }

  private transactionMigration(
    code: string,
    from: string,
  ): { code: string; warnings: string[]; notes: string[] } {
    let transformed = code;
    const warnings: string[] = [];
    const notes: string[] = [];

    // Handle pipeline/multi transformations
    // Replace variable-initialized pipeline/multi() with Batch and track client for exec routing
    const execRedirects: Array<{ batchVar: string; clientExpr: string }> = [];

    transformed = transformed.replace(
      /const\s+(\w+)\s*=\s*([A-Za-z0-9_\.]+)\.pipeline\s*\(\s*\)\s*;/g,
      (match, batchVar: string, clientExpr: string) => {
        execRedirects.push({ batchVar, clientExpr });
        notes.push(
          `Converted ${batchVar} = ${clientExpr}.pipeline() to Batch(false) - non-atomic operations`,
        );
        return `const ${batchVar} = new Batch(false);`;
      },
    );

    transformed = transformed.replace(
      /const\s+(\w+)\s*=\s*([A-Za-z0-9_\.]+)\.multi\s*\(\s*\)\s*;/g,
      (match, batchVar: string, clientExpr: string) => {
        execRedirects.push({ batchVar, clientExpr });
        notes.push(
          `Converted ${batchVar} = ${clientExpr}.multi() to Batch(true) - atomic operations`,
        );
        return `const ${batchVar} = new Batch(true);`;
      },
    );

    // If direct method calls like redis.pipeline() without variable assignment exist, fallback simple replacement
    if (/\.pipeline\s*\(\s*\)/.test(transformed)) {
      transformed = transformed.replace(
        /\.pipeline\s*\(\s*\)/g,
        "new Batch(false)",
      );
      notes.push(
        "Converted pipeline() to Batch(false) - non-atomic operations",
      );
    }
    if (/\.multi\s*\(\s*\)/.test(transformed)) {
      transformed = transformed.replace(
        /\.multi\s*\(\s*\)/g,
        "new Batch(true)",
      );
      notes.push("Converted multi() to Batch(true) - atomic operations");
    }

    // Redirect exec calls on batch variables to client.exec(batchVar)
    execRedirects.forEach(({ batchVar, clientExpr }) => {
      // pipeline.exec() -> client.exec(batch)
      const execCallRegex = new RegExp(`${batchVar}\\.exec\\s*\\(\\s*\\)`, "g");
      transformed = transformed.replace(
        execCallRegex,
        `${clientExpr}.exec(${batchVar})`,
      );

      // pipeline.set(...) -> batch.set(...)
      const methodNames = [
        "set",
        "get",
        "del",
        "exists",
        "expire",
        "hset",
        "hget",
        "lpush",
        "lpop",
        "rpush",
        "rpop",
        "sadd",
        "srem",
        "zadd",
      ];
      methodNames.forEach((m) => {
        const re = new RegExp(
          `${clientExpr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.${batchVar}\\.${m}`,
          "g",
        );
        transformed = transformed.replace(re, `${batchVar}.${m}`);
      });
    });

    // If generic .exec() present, ensure it receives a batch variable
    if (/\.exec\s*\(\s*\)/.test(transformed)) {
      transformed = transformed.replace(/\.exec\s*\(\s*\)/g, ".exec(batch)");
      warnings.push(
        "Ensure 'batch' variable is properly defined before exec()",
      );
    }

    // Add Batch import
    if (transformed.includes("Batch")) {
      transformed = transformed.replace(
        /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
        "$1, Batch$2",
      );
    }

    // Apply common transformations
    transformed = this.applyCommonTransformations(transformed);

    return { code: transformed, warnings, notes };
  }

  private advancedMigration(
    code: string,
    from: string,
    patterns: string[],
  ): { code: string; warnings: string[]; notes: string[] } {
    let transformed = code;
    const warnings: string[] = [];
    const notes: string[] = [];

    // Handle Lua scripts
    if (patterns.includes("lua")) {
      transformed = transformed.replace(
        /\.eval\s*\(\s*(['"`])(.*?)\1\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gs,
        (match, quote, script, numKeys, args) => {
          notes.push("Converted eval() to Script object pattern");
          return `new Script(${quote}${script}${quote}).execute(client, { keys: ${args.split(",").slice(0, parseInt(numKeys))}, args: ${args.split(",").slice(parseInt(numKeys))} })`;
        },
      );

      // Add Script import
      if (transformed.includes("Script")) {
        transformed = transformed.replace(
          /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
          "$1, Script$2",
        );
      }

      warnings.push(
        "Lua script execution syntax has changed - review Script object usage",
      );
    }

    // Handle pub/sub
    if (patterns.includes("pubsub")) {
      // Emit full GLIDE pub/sub skeleton at creation time
      // Replace new Redis(...) subscriber creation with Glide client configured for subscriptions
      transformed = transformed.replace(
        /(const\s+\w+\s*=\s*)new\s+Redis\s*\(\s*([0-9]+)\s*,\s*(['"][^'"]+['"])\s*\)\s*;?/g,
        (match, lhs: string, port: string, host: string) => {
          return `${lhs}await GlideClient.createClient({ addresses: [{ host: ${host}, port: ${port} }],\n  pubsubSubscriptions: {\n    channelsAndPatterns: { [GlideClientConfiguration.PubSubChannelModes.Exact]: new Set([]) }\n  }\n});`;
        },
      );

      // If no explicit ctor matched, ensure we show a correct pattern comment
      notes.push(
        "Use GlideClient.createClient({ pubsubSubscriptions: { channelsAndPatterns: { [GlideClientConfiguration.PubSubChannelModes.Exact]: new Set([...]) } } })",
      );

      // Extract subscribed channels/patterns from source and inject into configuration
      try {
        const exactChannels = Array.from(
          new Set(
            Array.from(
              code.matchAll(/\.subscribe\s*\(\s*(['\"])([^'\"]+)\1/g),
            ).map((m) => m[2]),
          ),
        );
        const patternChannels = Array.from(
          new Set(
            Array.from(
              code.matchAll(/\.psubscribe\s*\(\s*(['\"])([^'\"]+)\1/g),
            ).map((m) => m[2]),
          ),
        );

        if (exactChannels.length > 0 || patternChannels.length > 0) {
          const exactEntry = exactChannels.length
            ? `[GlideClientConfiguration.PubSubChannelModes.Exact]: new Set([${exactChannels
                .map((c) => `'${c}'`)
                .join(", ")}])`
            : "";
          const patternEntry = patternChannels.length
            ? `[GlideClientConfiguration.PubSubChannelModes.Pattern]: new Set([${patternChannels
                .map((c) => `'${c}'`)
                .join(", ")}])`
            : "";
          const joiner = exactEntry && patternEntry ? ", " : "";

          // Replace placeholder new Set([]) with populated entries
          transformed = transformed.replace(
            /channelsAndPatterns:\s*\{\s*\[GlideClientConfiguration\.PubSubChannelModes\.Exact\]:\s*new Set\(\[\]\)\s*\}/,
            `channelsAndPatterns: { ${exactEntry}${joiner}${patternEntry} }`,
          );

          // Remove legacy subscribe/psubscribe calls
          transformed = transformed.replace(
            /[^\n;]*\.p?subscribe\s*\(\s*['\"][^'\"]+['\"]\s*\)\s*;?\s*\n/g,
            "",
          );
        }
      } catch {
        // best-effort injection; ignore errors silently
      }

      // Replace legacy '<receiver>.on("message")' with repeated getPubSubMessage awaits on the same receiver
      transformed = transformed.replace(
        /([A-Za-z0-9_\.]+)\.on\s*\(\s*['"]message['"]\s*,\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\}\s*\)\s*;?/g,
        (match, receiver: string, params: string, body: string) => {
          const cleanedBody = body.trim();
          return `// GLIDE Pub/Sub consumption\n(async () => {\n  while (true) {\n    const msg = await ${receiver}.getPubSubMessage();\n    const channel = msg.channel as string;\n    const message = msg.message as string;\n    ${cleanedBody}\n  }\n})();`;
        },
      );

      // Inject pubsubSubscriptions into subscriber client creation based on detected channels/patterns
      try {
        const exactChannels = Array.from(
          new Set(
            Array.from(
              code.matchAll(/\.subscribe\s*\(\s*(['\"])([^'\"]+)\1/g),
            ).map((m) => m[2] as string),
          ),
        );
        const patternChannels = Array.from(
          new Set(
            Array.from(
              code.matchAll(/\.psubscribe\s*\(\s*(['\"])([^'\"]+)\1/g),
            ).map((m) => m[2] as string),
          ),
        );
        const subscriberVars = Array.from(
          new Set(
            Array.from(code.matchAll(/([A-Za-z0-9_\.]+)\.subscribe\s*\(/g)).map(
              (m) => m[1],
            ),
          ),
        );

        if (
          (exactChannels.length > 0 || patternChannels.length > 0) &&
          subscriberVars.length > 0
        ) {
          const configEntries: string[] = [];
          if (exactChannels.length > 0) {
            configEntries.push(
              `[GlideClientConfiguration.PubSubChannelModes.Exact]: new Set([${exactChannels
                .map((c: string) => `'${c}'`)
                .join(", ")}])`,
            );
          }
          if (patternChannels.length > 0) {
            configEntries.push(
              `[GlideClientConfiguration.PubSubChannelModes.Pattern]: new Set([${patternChannels
                .map((c: string) => `'${c}'`)
                .join(", ")}])`,
            );
          }
          const configSnippet = `, pubsubSubscriptions: { channelsAndPatterns: { ${configEntries.join(", ")} } }`;

          subscriberVars.forEach((v) => {
            const re = new RegExp(
              `(const\\s+${v}\\s*=\\s*await\\s+GlideClient\\.createClient\\s*\\(\\s*\\{\\s*addresses\\s*:\\s*\\[[\\s\\S]*?\\]\\s*)(\\})`,
              "g",
            );
            transformed = transformed.replace(
              re,
              (_m, head: string, closeBrace: string) => {
                if (/pubsubSubscriptions\s*:/.test(_m)) return _m; // already has config
                return `${head}${configSnippet} ${closeBrace}`;
              },
            );
          });

          if (
            configEntries.length > 0 &&
            !/GlideClientConfiguration/.test(transformed)
          ) {
            transformed = transformed.replace(
              /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
              "$1, GlideClientConfiguration$2",
            );
            transformed = transformed.replace(
              /(const\s*\{[^}]*)(\}\s*=\s*require\(\s*['"]@valkey\/valkey-glide['"]\s*\)\s*;?)/g,
              "$1, GlideClientConfiguration$2",
            );
          }
        }
      } catch {
        // best-effort injection
      }

      // Ensure imports mention GlideClientConfiguration for enum access if used
      if (transformed.includes("GlideClientConfiguration.PubSubChannelModes")) {
        transformed = transformed.replace(
          /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
          "$1, GlideClientConfiguration$2",
        );
        transformed = transformed.replace(
          /(const\s*\{[^}]*)(\}\s*=\s*require\(\s*['"]@valkey\/valkey-glide['"]\s*\)\s*;?)/g,
          "$1, GlideClientConfiguration$2",
        );
      }

      // Correct publish signature to GLIDE order: publish(message, channel)
      transformed = transformed.replace(
        /\.publish\s*\(\s*([^,]+)\s*,\s*([^\)]+)\s*\)/g,
        (m, arg1: string, arg2: string) =>
          `.publish(${arg2.trim()}, ${arg1.trim()})`,
      );
    }

    // Handle streams
    if (patterns.includes("streams")) {
      notes.push(
        "Stream operations syntax is similar but review GLIDE-specific parameters",
      );
    }

    // Handle blocking operations
    if (patterns.includes("blocking")) {
      warnings.push(
        "Blocking operations may have different timeout behavior in GLIDE",
      );
    }

    // Apply specific transformations based on source
    if (from === "ioredis") {
      transformed = this.applyIoredisTransformations(transformed);
    } else if (from === "node-redis") {
      transformed = this.applyNodeRedisTransformations(transformed);
    }

    // After source-specific transforms, if pubsub, inject pubsubSubscriptions into created clients for subscribers
    if (patterns.includes("pubsub")) {
      try {
        const exactChannels = Array.from(
          new Set(
            Array.from(
              code.matchAll(/\.subscribe\s*\(\s*(['\"])([^'\"]+)\1/g),
            ).map((m) => m[2] as string),
          ),
        );
        const patternChannels = Array.from(
          new Set(
            Array.from(
              code.matchAll(/\.psubscribe\s*\(\s*(['\"])([^'\"]+)\1/g),
            ).map((m) => m[2] as string),
          ),
        );
        const subscriberVars = Array.from(
          new Set(
            Array.from(code.matchAll(/([A-Za-z0-9_\.]+)\.subscribe\s*\(/g)).map(
              (m) => m[1],
            ),
          ),
        );

        if (
          (exactChannels.length > 0 || patternChannels.length > 0) &&
          subscriberVars.length > 0
        ) {
          const configEntries: string[] = [];
          if (exactChannels.length > 0) {
            configEntries.push(
              `[GlideClientConfiguration.PubSubChannelModes.Exact]: new Set([${exactChannels
                .map((c: string) => `'${c}'`)
                .join(", ")}])`,
            );
          }
          if (patternChannels.length > 0) {
            configEntries.push(
              `[GlideClientConfiguration.PubSubChannelModes.Pattern]: new Set([${patternChannels
                .map((c: string) => `'${c}'`)
                .join(", ")}])`,
            );
          }
          const configSnippet = `, pubsubSubscriptions: { channelsAndPatterns: { ${configEntries.join(", ")} } }`;

          subscriberVars.forEach((v) => {
            const re = new RegExp(
              `(const\\s+${v}\\s*=\\s*await\\s+GlideClient\\.createClient\\s*\\(\\s*\\{\\s*addresses\\s*:\\s*\\[[\\s\\S]*?\\]\\s*)(\\})`,
              "g",
            );
            transformed = transformed.replace(
              re,
              (_m, head: string, closeBrace: string) => {
                if (/pubsubSubscriptions\s*:/.test(_m)) return _m;
                return `${head}${configSnippet} ${closeBrace}`;
              },
            );
          });

          if (
            configEntries.length > 0 &&
            !/GlideClientConfiguration/.test(transformed)
          ) {
            transformed = transformed.replace(
              /(import\s+\{[^}]*)(}\s+from\s+['"]@valkey\/valkey-glide['"];?)/g,
              "$1, GlideClientConfiguration$2",
            );
            transformed = transformed.replace(
              /(const\s*\{[^}]*)(\}\s*=\s*require\(\s*['"]@valkey\/valkey-glide['"]\s*\)\s*;?)/g,
              "$1, GlideClientConfiguration$2",
            );
          }
        }
      } catch {
        // best-effort injection
      }
    }

    return { code: transformed, warnings, notes };
  }

  private applyIoredisTransformations(code: string): string {
    let transformed = code;

    // Basic import replacement
    transformed = transformed.replace(
      /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
      "import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';",
    );

    // CommonJS require replacement
    transformed = transformed.replace(
      /(?:const|let|var)\s+Redis\s*=\s*require\(\s*['"]ioredis['"]\s*\);?/g,
      (match) => {
        // If GLIDE require already present, drop the ioredis require
        if (
          /require\(\s*['"]@valkey\/valkey-glide['"]\s*\)/.test(transformed)
        ) {
          return "";
        }
        return "const { GlideClient, GlideClusterClient, Batch, Script } = require('@valkey/valkey-glide');";
      },
    );

    // Connection patterns
    transformed = transformed.replace(
      /new\s+Redis\s*\(\s*\)/g,
      "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })",
    );

    // new Redis(port, host)
    transformed = transformed.replace(
      /new\s+Redis\s*\(\s*([0-9]+)\s*,\s*(['"][^'"]+['"])\s*\)/g,
      (match, port: string, host: string) => {
        return `await GlideClient.createClient({ addresses: [{ host: ${host}, port: ${port} }] })`;
      },
    );

    transformed = transformed.replace(
      /new\s+Redis\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      (match, url) => {
        if (url.startsWith("redis://") || url.startsWith("rediss://")) {
          return `await GlideClient.createClient(parseRedisUrl('${url}'))`;
        }
        return "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })";
      },
    );

    // Command transformations
    transformed = transformed.replace(
      /\.setex\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })",
    );

    transformed = transformed.replace(
      /\.psetex\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'PX', count: $2 } })",
    );

    // quit() -> close()
    transformed = transformed.replace(/\.quit\s*\(\s*\)\s*;?/g, ".close();");

    // Remove legacy subscribe/psubscribe calls (subscriptions configured at creation time in GLIDE)
    transformed = transformed.replace(
      /[^\n;]*\.p?subscribe\s*\(\s*[^\)]*\)\s*;?\s*\n/g,
      "",
    );

    // Pub/Sub message handler replacement: use repeated getPubSubMessage awaits
    transformed = transformed.replace(
      /\.on\s*\(\s*['"]message['"]\s*,\s*(\([^)]*\)\s*=>\s*\{[\s\S]*?\})\s*\)\s*;?/g,
      (match, handler: string) => {
        const body = handler.replace(/^\(|\)\s*=>\s*\{|\}$/g, "").trim();
        return `/* GLIDE Pub/Sub consumption example:\nwhile (true) {\n  const msg = await subscriber.getPubSubMessage();\n  const channel = msg.channel as string;\n  const message = msg.message as string;\n  ${body}\n}\n*/`;
      },
    );

    return transformed;
  }

  private applyNodeRedisTransformations(code: string): string {
    let transformed = code;

    // Import replacement
    transformed = transformed.replace(
      /import\s+\{[^}]*\}\s+from\s+['"]redis['"];?/g,
      "import { GlideClient, GlideClusterClient } from '@valkey/valkey-glide';",
    );

    // CommonJS require replacement
    transformed = transformed.replace(
      /(?:const|let|var)\s+\w+\s*=\s*require\(\s*['"]redis['"]\s*\);?/g,
      "const { GlideClient, GlideClusterClient, Batch, Script } = require('@valkey/valkey-glide');",
    );

    // Connection patterns
    transformed = transformed.replace(
      /createClient\s*\(\s*\)/g,
      "GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })",
    );

    transformed = transformed.replace(
      /createClient\s*\(\s*\{[^}]*url:\s*['"]([^'"]+)['"][^}]*\}\s*\)/g,
      (match, url) => {
        return `GlideClient.createClient(parseRedisUrl('${url}'))`;
      },
    );

    // Remove .connect() calls as GLIDE connects automatically
    transformed = transformed.replace(/\.connect\s*\(\s*\);?\s*/g, ";");

    // Command transformations
    transformed = transformed.replace(
      /\.setEx\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })",
    );

    // quit() -> close()
    transformed = transformed.replace(/\.quit\s*\(\s*\)\s*;?/g, ".close();");

    return transformed;
  }

  private applyCommonTransformations(code: string): string {
    let transformed = code;

    // Common command differences
    transformed = transformed.replace(
      /\.del\s*\(\s*([^)]+)\s*\)/g,
      (match, keys) => {
        // Ensure keys are in array format for GLIDE
        if (keys.includes("[") && keys.includes("]")) {
          return `.del(${keys})`;
        } else {
          return `.del([${keys}])`;
        }
      },
    );

    transformed = transformed.replace(
      /\.exists\s*\(\s*([^)]+)\s*\)/g,
      (match, keys) => {
        // Ensure keys are in array format for GLIDE
        if (keys.includes("[") && keys.includes("]")) {
          return `.exists(${keys})`;
        } else {
          return `.exists([${keys}])`;
        }
      },
    );

    return transformed;
  }
}

/**
 * Register the smart migration engine with the MCP server
 */
export function registerSmartMigrationEngine(mcp: McpServer) {
  const engine = new SmartMigrationEngine();

  (mcp as any).tool(
    "migrate",
    "Smart migration engine for converting Redis client code to GLIDE",
    async (args: any) => {
      // Normalize arguments: support JSON strings or { random_string: "{...}" }
      let normalizedArgs: any = args;
      try {
        if (typeof normalizedArgs === "string") {
          normalizedArgs = JSON.parse(normalizedArgs);
        } else if (
          normalizedArgs &&
          typeof normalizedArgs.random_string === "string"
        ) {
          const maybe = JSON.parse(normalizedArgs.random_string);
          if (maybe && typeof maybe === "object") {
            normalizedArgs = maybe;
          }
        }
      } catch {
        // If parsing fails, fall back to original args
      }

      const context = {
        userIntent: "migration" as const,
        complexity: "advanced" as const,
        clientCapabilities: "full" as const,
        taskType: "transform" as const,
        hasParameters: args && Object.keys(args).length > 0,
        patterns: [],
      };

      return engine.execute(normalizedArgs, context);
    },
  );
}

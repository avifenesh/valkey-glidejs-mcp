import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Minimal, regex-based migration scaffolding for quick suggestions.
// Future work: integrate ts-morph or recast for AST-level transforms.

function parseRedisUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const config = {
      addresses: [{
        host: parsed.hostname || 'localhost',
        port: parsed.port ? parseInt(parsed.port) : 6379
      }]
    };
    
    // Add TLS configuration for rediss://
    if (parsed.protocol === 'rediss:') {
      (config as any).useTLS = true;
    }
    
    // Add authentication if present
    if (parsed.username || parsed.password) {
      (config as any).credentials = {
        username: parsed.username || undefined,
        password: parsed.password || undefined
      };
    }
    
    return JSON.stringify(config, null, 2).replace(/"/g, "'");
  } catch (error) {
    return `{ addresses: [{ host: 'localhost', port: 6379 }] }
      /* URL parsing failed for: ${url} */`;
  }
}

function naiveTransform(source: string, from: "ioredis" | "node-redis") {
  let code = source;
  if (from === "ioredis") {
    // Import transformations
    code = code.replace(
      /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
      "import { GlideClient, GlideClusterClient, Transaction, Script } from '@valkey/valkey-glide';",
    );

    // Handle URL-based connections first
    code = code.replace(
      /new\s+Redis\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      (_, url) => {
        // Parse common Redis URL patterns
        if (url.startsWith("redis://") || url.startsWith("rediss://")) {
          const parsedConfig = parseRedisUrl(url);
          return `await GlideClient.createClient(${parsedConfig})`;
        }
        return `await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })`;
      },
    );

    // Handle environment variable URLs
    code = code.replace(
      /new\s+Redis\s*\(\s*(process\.env\.[A-Z_]+[^)]*)\)/g,
      (_, envVar) => {
        return `/* Parse URL from environment variable */
const redisUrl = ${envVar};
const client = await GlideClient.createClient(
  redisUrl ? parseRedisUrlRuntime(redisUrl) : { addresses: [{ host: 'localhost', port: 6379 }] }
);

/* Helper function to add to your codebase:
function parseRedisUrlRuntime(url: string) {
  const parsed = new URL(url);
  const config = {
    addresses: [{ host: parsed.hostname || 'localhost', port: parseInt(parsed.port) || 6379 }]
  };
  if (parsed.protocol === 'rediss:') config.useTLS = true;
  if (parsed.username || parsed.password) {
    config.credentials = { username: parsed.username, password: parsed.password };
  }
  return config;
}
*/`;
      },
    );

    // Client creation transformations with configuration mapping
    code = code.replace(/new\s+Redis\s*\(([^)]*)\)/g, (_, configStr) => {
      if (!configStr.trim()) {
        return "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })";
      }

      // Skip if it's a URL pattern (already handled above)
      if (
        configStr.includes("redis://") ||
        configStr.includes("rediss://") ||
        configStr.includes("process.env")
      ) {
        return `new Redis(${configStr})`; // Let the URL handlers above catch it
      }

      // Try to extract common ioredis config patterns
      let glideConfig = "{ addresses: [{ host: 'localhost', port: 6379 }]";

      // Extract host and port if present
      const hostMatch = configStr.match(/host:\s*['"]([^'"]+)['"]/);
      const portMatch = configStr.match(/port:\s*(\d+)/);

      if (hostMatch || portMatch) {
        const host = hostMatch ? hostMatch[1] : "localhost";
        const port = portMatch ? portMatch[1] : "6379";
        glideConfig = `{ addresses: [{ host: '${host}', port: ${port} }]`;
      }

      // Map retry configurations
      const retryDelayMatch = configStr.match(/retryDelayOnFailover:\s*(\d+)/);
      const maxRetriesMatch = configStr.match(
        /maxRetriesPerRequest:\s*(\d+|null)/,
      );

      if (retryDelayMatch || maxRetriesMatch) {
        glideConfig += `, connectionRetryStrategy: {`;
        if (maxRetriesMatch && maxRetriesMatch[1] !== "null") {
          glideConfig += ` numberOfRetries: ${maxRetriesMatch[1]},`;
        }
        if (retryDelayMatch) {
          glideConfig += ` baseDelay: ${retryDelayMatch[1]},`;
        }
        glideConfig += ` factor: 2`;
        glideConfig += ` }`;
      }

      glideConfig += " }";
      return `await GlideClient.createClient(${glideConfig})`;
    });

    code = code.replace(
      /new\s+Redis\.Cluster\s*\(([^)]*)\)/g,
      "await GlideClusterClient.createClient({ addresses: [] })",
    );

    // Method transformations for common patterns
    // setex -> set with expiry option
    code = code.replace(
      /\.setex\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })",
    );

    // Pipeline -> Transaction (improved variable tracking)
    const pipelineVariables = new Set();

    // Track pipeline variable declarations
    code = code.replace(
      /const\s+(\w+)\s*=\s*(\w+)\.pipeline\(\);/g,
      (_, varName) => {
        pipelineVariables.add(varName);
        return `const ${varName} = new Transaction();`;
      },
    );

    // Handle direct pipeline calls without variable assignment
    code = code.replace(/(\w+)\.pipeline\(\);/g, () => {
      return "const tx = new Transaction();";
    });

    // Fix transaction execution to use the correct client variable
    // First extract client variable name from the code
    const clientVarMatch = code.match(
      /const\s+(\w+)\s*=\s*await\s+GlideClient\.createClient/,
    );
    const clientVar = clientVarMatch ? clientVarMatch[1] : "client";

    code = code.replace(/await\s+(\w+)\.exec\(\);/g, (_, varName) => {
      if (pipelineVariables.has(varName)) {
        return `await ${clientVar}.exec(${varName});`;
      }
      return `await ${clientVar}.exec(${varName});`;
    });

    // Fix client.close() calls to use correct variable name
    code = code.replace(/client\.close\(\);?/g, `${clientVar}.close();`);

    // Conditional SET transformations (SET key value PX milliseconds NX)
    code = code.replace(
      /\.set\s*\(\s*([^,]+),\s*([^,]+),\s*['"]PX['"],\s*([^,]+),\s*['"]NX['"]\)/g,
      ".set($1, $2, { expiry: { type: 'PX', count: $3 }, conditionalSet: 'onlyIfDoesNotExist' })",
    );

    // Conditional SET transformations (SET key value EX seconds NX)
    code = code.replace(
      /\.set\s*\(\s*([^,]+),\s*([^,]+),\s*['"]EX['"],\s*([^,]+),\s*['"]NX['"]\)/g,
      ".set($1, $2, { expiry: { type: 'EX', count: $3 }, conditionalSet: 'onlyIfDoesNotExist' })",
    );

    // MGET spread arguments -> array
    code = code.replace(/\.mget\s*\(\s*\.\.\.([^)]+)\)/g, ".mget($1)");

    // Lua Script migration (eval -> Script object) - improved with proper structure
    code = code.replace(
      /\.eval\s*\(\s*`([^`]+)`,\s*(\d+),\s*([^)]+)\)/g,
      (_, scriptCode, numKeys, argsStr) => {
        const scriptVar = `${scriptCode.match(/\w+/)?.[0] || 'script'}_script`.toLowerCase();
        const args = argsStr.split(",").map((arg: string) => arg.trim());
        const keys = args.slice(0, parseInt(numKeys));
        const scriptArgs = args.slice(parseInt(numKeys));

        return `
/* Define this script at module level for reuse */
const ${scriptVar} = new Script(\`${scriptCode}\`);

/* Then use it in your function */
await client.invokeScript(${scriptVar}, { keys: [${keys.join(", ")}], args: [${scriptArgs.join(", ")}] })`;
      },
    );

    // Handle eval with string literals
    code = code.replace(
      /\.eval\s*\(\s*['"]([^'"]+)['"],\s*(\d+),\s*([^)]+)\)/g,
      (_, scriptCode, numKeys, argsStr) => {
        const scriptVar = `${scriptCode.match(/\w+/)?.[0] || 'script'}_script`.toLowerCase();
        const args = argsStr.split(",").map((arg: string) => arg.trim());
        const keys = args.slice(0, parseInt(numKeys));
        const scriptArgs = args.slice(parseInt(numKeys));

        return `
/* Define this script at module level for reuse */
const ${scriptVar} = new Script("${scriptCode}");

/* Then use it in your function */
await client.invokeScript(${scriptVar}, { keys: [${keys.join(", ")}], args: [${scriptArgs.join(", ")}] })`;
      },
    );

    // Pub/Sub pattern migration - detect and suggest client callback approach
    if (code.includes(".subscribe(") || code.includes(".psubscribe(")) {
      code =
        `/* GLIDE Pub/Sub Migration Guide:
 * 
 * OLD PATTERN (ioredis):
 * redis.subscribe('channel');
 * redis.on('message', (channel, message) => { ... });
 * 
 * NEW PATTERN (GLIDE):
 * const client = await GlideClient.createClient({
 *   addresses: [{ host: 'localhost', port: 6379 }],
 *   pubsubSubscriptions: {
 *     channels: {
 *       'channel-name': (message, channel) => {
 *         console.log(\`Received from \${channel}: \${message}\`);
 *       }
 *     },
 *     patterns: {
 *       'news.*': (message, channel) => {
 *         console.log(\`Pattern match from \${channel}: \${message}\`);
 *       }
 *     }
 *   }
 * });
 */
` + code;
    }

    // Transform basic subscribe patterns
    code = code.replace(
      /\.subscribe\s*\(\s*['"]([^'"]+)['"]\s*\);/g,
      "/* Use pubsubSubscriptions in client config for: $1 */",
    );

    code = code.replace(
      /\.psubscribe\s*\(\s*['"]([^'"]+)['"]\s*\);/g,
      "/* Use pubsubSubscriptions with pattern for: $1 */",
    );

    // Transform publish (this one is straightforward)
    code = code.replace(/\.publish\s*\(/g, ".publish(");

    // Blocking operations migration - use native GLIDE methods
    code = code.replace(
      /\.brpoplpush\s*\(/g,
      '.blmove(', // GLIDE uses modern BLMOVE instead of deprecated BRPOPLPUSH
    );

    code = code.replace(
      /\.blpop\s*\(/g,
      '.blpop(',
    );

    code = code.replace(
      /\.brpop\s*\(/g,
      '.brpop(',
    );

    code = code.replace(
      /\.bzpopmin\s*\(/g,
      '.bzpopmin(',
    );

    code = code.replace(
      /\.bzpopmax\s*\(/g,
      '.bzpopmax(',
    );
  } else {
    // node-redis transformations (enhanced for real-world patterns)

    // Import transformations
    code = code.replace(/from\s+['"]redis['"]/g, "from '@valkey/valkey-glide'");
    code = code.replace(
      /import\s*{\s*createClient\s*}\s*from/g,
      "import { GlideClient, GlideClusterClient, Transaction, Script } from",
    );
    code = code.replace(
      /import\s*{\s*(RedisStore)\s*}\s*from\s*['"]connect-redis['"]/g,
      "import { $1 } from 'connect-redis'",
    );

    // Client creation with configuration mapping
    code = code.replace(
      /createClient\s*\(\s*\)/g,
      "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })",
    );

    // Handle URL-based connections
    code = code.replace(
      /createClient\s*\(\s*{\s*url:\s*([^}]+)\s*}\s*\)/g,
      (_, urlExpr) => {
        if (urlExpr.includes("process.env") || urlExpr.includes("||")) {
          return `/* Parse URL from environment variable */
const redisUrl = ${urlExpr};
const client = await GlideClient.createClient(
  redisUrl ? parseRedisUrlRuntime(redisUrl) : { addresses: [{ host: 'localhost', port: 6379 }] }
);`;
        }
        // Try to parse if it's a direct URL string
        const urlMatch = urlExpr.match(/['"]([^'"]+)['"]/);
        if (urlMatch) {
          const parsedConfig = parseRedisUrl(urlMatch[1]);
          return `await GlideClient.createClient(${parsedConfig})`;
        }
        return "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })";
      },
    );

    // Handle socket configuration (reconnection strategies)
    code = code.replace(
      /createClient\s*\(\s*{\s*socket:\s*{[^}]*reconnectStrategy[^}]*}\s*}\s*\)/g,
      `await GlideClient.createClient({ 
        addresses: [{ host: 'localhost', port: 6379 }],
        connectionRetryStrategy: { numberOfRetries: 10, baseDelay: 100, factor: 2 }
      })`,
    );

    // Connection handling
    code = code.replace(
      /(\w+)\.connect\(\)\.catch\(console\.error\);?/g,
      "// Connection is automatic in GLIDE",
    );
    code = code.replace(
      /await\s+(\w+)\.connect\(\);?/g,
      "// Connection is automatic in GLIDE",
    );
    code = code.replace(
      /(\w+)\.connect\(\);?/g,
      "// Connection is automatic in GLIDE",
    );

    // Disconnection
    code = code.replace(/(\w+)\.disconnect\(\);?/g, "$1.close();");

    // Hash operations (node-redis uses different casing)
    code = code.replace(/\.hSet\(/g, ".hset(");
    code = code.replace(/\.hGet\(/g, ".hget(");
    code = code.replace(/\.hGetAll\(/g, ".hgetAll(");

    // SetEx operations
    code = code.replace(
      /\.setEx\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })",
    );

    // SET with options (node-redis v4 style)
    code = code.replace(
      /\.set\s*\(\s*([^,]+),\s*([^,]+),\s*{\s*EX:\s*([^}]+)\s*}\)/g,
      ".set($1, $2, { expiry: { type: 'EX', count: $3 } })",
    );

    // Transaction handling (multi/exec)
    const multiVariables = new Set();

    // Track multi variable declarations and chained multi calls
    code = code.replace(
      /const\s+\[([^\]]+)\]\s*=\s*await\s+(\w+)\s*\.multi\(\)/g,
      (match, destructure, clientVar) => {
        return `const tx = new Transaction();\n    // TODO: Chain your commands to tx, then:\n    const [${destructure}] = await ${clientVar}.exec(tx)`;
      },
    );

    // Handle direct multi chains
    code = code.replace(/await\s+(\w+)\.multi\(\)/g, (_, clientVar) => {
      return `const tx = new Transaction();\n    // TODO: Chain your commands to tx, then:\n    await ${clientVar}.exec(tx)`;
    });

    // Handle pipeline executions
    code = code.replace(
      /\.execAsPipeline\(\)/g,
      "/* TODO: Use Transaction instead of pipeline */ .exec(tx)",
    );

    // Pub/Sub transformations
    code = code.replace(
      /await\s+(\w+)\.subscribe\s*\(\s*['"]([^'"]+)['"],\s*([^)]+)\)/g,
      "/* TODO: GLIDE Pub/Sub requires callback configuration during client creation\n" +
        " * Configure pubsubSubscriptions in GlideClient.createClient() options\n" +
        " */ // $1.subscribe('$2', $3)",
    );

    code = code.replace(
      /await\s+(\w+)\.pSubscribe\s*\(\s*['"]([^'"]+)['"],\s*([^)]+)\)/g,
      "/* TODO: Use pattern-based pubsubSubscriptions in client config */ // $1.pSubscribe('$2', $3)",
    );

    code = code.replace(
      /await\s+(\w+)\.unsubscribe\(\)/g,
      "/* TODO: Unsubscribe not directly supported - recreate client if needed */ // $1.unsubscribe()",
    );

    code = code.replace(
      /await\s+(\w+)\.pUnsubscribe\(\)/g,
      "/* TODO: Pattern unsubscribe not directly supported */ // $1.pUnsubscribe()",
    );

    // JSON operations (if present)
    code = code.replace(/\.json\.set\(/g, ".json.set(");
    code = code.replace(/\.json\.get\(/g, ".json.get(");
    code = code.replace(/\.json\.numIncrBy\(/g, ".json.numIncrBy(");
    code = code.replace(/\.json\.arrAppend\(/g, ".json.arrAppend(");

    // Lua scripting
    code = code.replace(
      /await\s+(\w+)\.eval\s*\(\s*([^,]+),\s*{\s*keys:\s*\[([^\]]*)\],\s*arguments:\s*\[([^\]]*)\]\s*}\)/g,
      (_, clientVar, scriptVar, keys, args) => {
        return (
          `/* TODO: Create Script object */\n` +
          `const script = new Script(${scriptVar});\n` +
          `await ${clientVar}.invokeScript(script, { keys: [${keys}], args: [${args}] })`
        );
      },
    );

    code = code.replace(
      /await\s+(\w+)\.scriptLoad\s*\(\s*([^)]+)\)/g,
      "/* TODO: Scripts are loaded automatically in GLIDE */ // scriptLoad($2)",
    );

    code = code.replace(
      /await\s+(\w+)\.evalSha\s*\(/g,
      "/* TODO: Use invokeScript with Script object */ // $1.evalSha(",
    );

    // Error event handlers
    code = code.replace(
      /(\w+)\.on\s*\(\s*['"]error['"],\s*([^)]+)\)/g,
      "// TODO: GLIDE handles errors differently - use try/catch around operations",
    );

    code = code.replace(
      /(\w+)\.on\s*\(\s*['"]connect['"],\s*([^)]+)\)/g,
      "// Connection events not available in GLIDE",
    );

    code = code.replace(
      /(\w+)\.on\s*\(\s*['"]ready['"],\s*([^)]+)\)/g,
      "// Ready events not available in GLIDE",
    );

    code = code.replace(
      /(\w+)\.on\s*\(\s*['"]end['"],\s*([^)]+)\)/g,
      "// End events not available in GLIDE",
    );
  }
  return code;
}

export function registerMigrationTools(mcp: McpServer) {
  mcp.tool(
    "migrate.naive",
    z.object({
      from: z.enum(["ioredis", "node-redis"]),
      code: z.string(),
    }).shape,
    async (args) => {
      const transformed = naiveTransform(args.code, args.from as any);
      return {
        structuredContent: { transformed },
        content: [{ type: "text", text: transformed }],
      } as any;
    },
  );
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Minimal, regex-based migration scaffolding for quick suggestions.
// Future work: integrate ts-morph or recast for AST-level transforms.

function naiveTransform(source: string, from: "ioredis" | "node-redis") {
  let code = source;
  if (from === "ioredis") {
    // Import transformations
    code = code.replace(
      /import\s+Redis\s+from\s+['"]ioredis['"];?/g,
      "import { GlideClient, GlideClusterClient, Transaction, Script } from '@valkey/valkey-glide';",
    );
    
    // Client creation transformations with configuration mapping
    code = code.replace(/new\s+Redis\s*\(([^)]*)\)/g, (_, configStr) => {
      if (!configStr.trim()) {
        return "await GlideClient.createClient({ addresses: [{ host: 'localhost', port: 6379 }] })";
      }
      
      // Try to extract common ioredis config patterns
      let glideConfig = "{ addresses: [{ host: 'localhost', port: 6379 }]";
      
      // Extract host and port if present
      const hostMatch = configStr.match(/host:\s*['"]([^'"]+)['"]/);
      const portMatch = configStr.match(/port:\s*(\d+)/);
      
      if (hostMatch || portMatch) {
        const host = hostMatch ? hostMatch[1] : 'localhost';
        const port = portMatch ? portMatch[1] : '6379';
        glideConfig = `{ addresses: [{ host: '${host}', port: ${port} }]`;
      }
      
      // Map retry configurations
      const retryDelayMatch = configStr.match(/retryDelayOnFailover:\s*(\d+)/);
      const maxRetriesMatch = configStr.match(/maxRetriesPerRequest:\s*(\d+|null)/);
      
      if (retryDelayMatch || maxRetriesMatch) {
        glideConfig += `, connectionRetryStrategy: {`;
        if (maxRetriesMatch && maxRetriesMatch[1] !== 'null') {
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
      ".set($1, $3, { expiry: { type: 'EX', count: $2 } })"
    );
    
    // Pipeline -> Transaction (improved variable tracking)
    const pipelineVariables = new Set();
    
    // Track pipeline variable declarations
    code = code.replace(/const\s+(\w+)\s*=\s*(\w+)\.pipeline\(\);/g, (_, varName) => {
      pipelineVariables.add(varName);
      return `const ${varName} = new Transaction();`;
    });
    
    // Handle direct pipeline calls without variable assignment
    code = code.replace(/(\w+)\.pipeline\(\);/g, () => {
      return 'const tx = new Transaction();';
    });
    
    // Fix transaction execution to use the correct client variable
    // First extract client variable name from the code
    const clientVarMatch = code.match(/const\s+(\w+)\s*=\s*await\s+GlideClient\.createClient/);
    const clientVar = clientVarMatch ? clientVarMatch[1] : 'client';
    
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
      ".set($1, $2, { expiry: { type: 'PX', count: $3 }, conditionalSet: 'onlyIfDoesNotExist' })"
    );
    
    // Conditional SET transformations (SET key value EX seconds NX)
    code = code.replace(
      /\.set\s*\(\s*([^,]+),\s*([^,]+),\s*['"]EX['"],\s*([^,]+),\s*['"]NX['"]\)/g,
      ".set($1, $2, { expiry: { type: 'EX', count: $3 }, conditionalSet: 'onlyIfDoesNotExist' })"
    );
    
    // MGET spread arguments -> array
    code = code.replace(/\.mget\s*\(\s*\.\.\.([^)]+)\)/g, ".mget($1)");
    
    // Lua Script migration (eval -> Script object)
    code = code.replace(
      /\.eval\s*\(\s*`([^`]+)`,\s*(\d+),\s*([^)]+)\)/g,
      (_, scriptCode, numKeys, argsStr) => {
        const scriptVar = `script_${Math.random().toString(36).substring(2, 11)}`;
        const args = argsStr.split(',').map((arg: string) => arg.trim());
        const keys = args.slice(0, parseInt(numKeys));
        const scriptArgs = args.slice(parseInt(numKeys));
        
        return `/* TODO: Define script outside function */
const ${scriptVar} = new Script(\`${scriptCode}\`);
await client.invokeScript(${scriptVar}, { keys: [${keys.join(', ')}], args: [${scriptArgs.join(', ')}] })`;
      }
    );
    
    // Handle eval with string literals
    code = code.replace(
      /\.eval\s*\(\s*['"]([^'"]+)['"],\s*(\d+),\s*([^)]+)\)/g,
      (_, scriptCode, numKeys, argsStr) => {
        const scriptVar = `script_${Math.random().toString(36).substring(2, 11)}`;
        const args = argsStr.split(',').map((arg: string) => arg.trim());
        const keys = args.slice(0, parseInt(numKeys));
        const scriptArgs = args.slice(parseInt(numKeys));
        
        return `/* TODO: Define script outside function */
const ${scriptVar} = new Script("${scriptCode}");
await client.invokeScript(${scriptVar}, { keys: [${keys.join(', ')}], args: [${scriptArgs.join(', ')}] })`;
      }
    );
    
    // Pub/Sub pattern migration - detect and suggest client callback approach
    if (code.includes('.subscribe(') || code.includes('.psubscribe(')) {
      code = `/* TODO: GLIDE Pub/Sub requires callback configuration during client creation
 * Instead of: redis.subscribe('channel'); redis.on('message', handler)
 * Use: GlideClient.createClient({ 
 *   addresses: [...],
 *   pubsubSubscriptions: {
 *     channels: { channelPatterns: { [channel]: handler } }
 *   }
 * })
 */
` + code;
    }
    
    // Transform basic subscribe patterns
    code = code.replace(/\.subscribe\s*\(\s*['"]([^'"]+)['"]\s*\);/g, 
      '/* Use pubsubSubscriptions in client config for: $1 */');
    
    code = code.replace(/\.psubscribe\s*\(\s*['"]([^'"]+)['"]\s*\);/g, 
      '/* Use pubsubSubscriptions with pattern for: $1 */');
    
    // Transform publish (this one is straightforward)
    code = code.replace(/\.publish\s*\(/g, '.publish(');
    
    // Blocking operations migration
    code = code.replace(/\.brpoplpush\s*\(/g, 
      '/* TODO: Use customCommand for BRPOPLPUSH */ .customCommand(["BRPOPLPUSH"');
    
    code = code.replace(/\.blpop\s*\(/g, 
      '/* TODO: Use customCommand for BLPOP */ .customCommand(["BLPOP"');
    
    code = code.replace(/\.brpop\s*\(/g, 
      '/* TODO: Use customCommand for BRPOP */ .customCommand(["BRPOP"');
    
    code = code.replace(/\.bzpopmin\s*\(/g, 
      '/* TODO: Use customCommand for BZPOPMIN */ .customCommand(["BZPOPMIN"');
    
    code = code.replace(/\.bzpopmax\s*\(/g, 
      '/* TODO: Use customCommand for BZPOPMAX */ .customCommand(["BZPOPMAX"');
    
  } else {
    // node-redis transformations
    code = code.replace(/from\s+['"]redis['"]/g, "from '@valkey/valkey-glide'");
    code = code.replace(/import\s*{\s*createClient\s*}\s*from/g, "import { GlideClient } from");
    code = code.replace(/createClient\s*\(/g, "GlideClient.createClient(");
    code = code.replace(/client\.connect\(\);?/g, "// Connection is automatic in GLIDE");
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

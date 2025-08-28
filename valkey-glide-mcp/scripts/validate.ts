import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerValidationTools } from '../src/tools/validate.js';

async function main() {
  const mcp = new McpServer({ name: 'validate', version: '0.0.0' });
  registerValidationTools(mcp);
  const tool = (mcp as any)._registeredTools?.['validate.glideSurface'];
  const res = await tool.callback({ writeReport: true } as any, {} as any);
  console.log(`Validated ${res.structuredContent.validatedCount}/${res.structuredContent.totalEntries} entries. Extracted ${res.structuredContent.extractedMethodCount} methods.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


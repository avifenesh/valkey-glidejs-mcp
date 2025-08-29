import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCommandsTools } from "../src/tools/commands.js";

async function main() {
  const mcp = new McpServer({ name: "ingest", version: "0.0.0" });
  registerCommandsTools(mcp);
  const tool = (mcp as any)._registeredTools?.["commands.ingest"];
  let start = 0;
  const count = 10;
  // Iterate until we see no progress (assume ~500 max)
  for (let i = 0; i < 200; i++) {
    const res = await tool.callback(
      { start, count, refresh: i === 0 } as any,
      {} as any,
    );
    console.log(
      `batch ${i}: start=${start} processed=${res.structuredContent.processed}`,
    );
    start += count;
    if (res.structuredContent.processed < count) break;
  }
  console.log("Done. See COMMANDS_INDEX.json and COMMANDS_BY_FAMILY.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

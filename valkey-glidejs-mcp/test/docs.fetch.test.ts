import { test } from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDocsTools } from "../src/tools/docs.js";

test("docs.fetch returns content", async () => {
  const mcp = new McpServer({ name: "test", version: "0.0.0" });
  registerDocsTools(mcp);
  const tool = (mcp as any)._registeredTools?.["docs.fetch"];
  const url = "data:text/plain,hello-world";
  const res = await tool.callback({ url } as any, {} as any);
  assert.match(res.content[0].text, /hello-world/);
});

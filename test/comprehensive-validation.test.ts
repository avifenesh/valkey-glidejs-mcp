import { test } from "node:test";
import assert from "node:assert";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerHealthTool } from "../src/tools/health.js";
import { registerDocsTools } from "../src/tools/docs.js";
import { registerApiTools } from "../src/tools/api.js";
import { registerMigrationTools } from "../src/tools/migrate.js";
import { registerGeneratorTools } from "../src/tools/generators.js";
import { registerVerifyTools } from "../src/tools/verify.js";
import { registerDataTools } from "../src/tools/data.js";
import { registerValidationTools } from "../src/tools/validate.js";
import { registerCommandsTools } from "../src/tools/commands.js";

test("Comprehensive MCP Server Validation", async (t) => {
  const mcp = new McpServer({ name: "test-server", version: "1.0.0" });

  // Register all tools
  registerHealthTool(mcp);
  registerDocsTools(mcp);
  registerApiTools(mcp);
  registerMigrationTools(mcp);
  registerGeneratorTools(mcp);
  registerVerifyTools(mcp);
  registerDataTools(mcp);
  registerValidationTools(mcp);
  registerCommandsTools(mcp);

  const registeredTools = Object.entries(
    (mcp as any)._registeredTools || {},
  ).map(([name, tool]: [string, any]) => ({
    name,
    handler: async (args: any) => tool.callback(args, {}),
    inputSchema: tool.inputSchema,
  }));

  await t.test("All tools are registered", () => {
    const expectedTools = [
      // Health
      "health",
      // Docs
      "docs.listSources",
      "docs.recommend",
      "docs.fetch",
      // API
      "api.findEquivalent",
      "api.search",
      "api.diff",
      "api.categories",
      "api.byCategory",
      "api.families",
      "api.byFamily",
      // Migration
      "migrate.naive",
      // Generators
      "gen.clientBasic",
      "gen.clientCluster",
      "gen.cache",
      "gen.lock",
      "gen.pubsubPublisher",
      "gen.pubsubSubscriber",
      "gen.pubsubAdvanced",
      "gen.fastify",
      "gen.rateLimiter",
      "gen.queueProducer",
      "gen.queueConsumer",
      "gen.sets",
      "gen.zsets",
      "gen.streams",
      "gen.transaction",
      "gen.pipeline",
      "gen.geo",
      "gen.bitmaps",
      "gen.hll",
      "gen.json",
      "gen.hashesAdvanced",
      "gen.listsAdvanced",
      "gen.zsetRankings",
      "gen.jsonAdvanced",
      "gen.scan",
      "gen.clientAdvanced",
      // Verify
      "verify.static",
      // Data
      "data.enrich",
      // Validate
      "validate.glideSurface",
      // Commands
      "commands.ingest",
      "commands.listFamilies",
      "commands.getByFamily",
    ];

    const registeredToolNames = registeredTools.map((t) => t.name);

    for (const toolName of expectedTools) {
      assert.ok(
        registeredToolNames.includes(toolName),
        `Tool ${toolName} should be registered`,
      );
    }

    assert.strictEqual(
      registeredTools.length,
      expectedTools.length,
      `Should have exactly ${expectedTools.length} tools registered`,
    );
  });

  await t.test("Tools with no parameters work correctly", async () => {
    // Test health tool
    const healthTool = registeredTools.find((t) => t.name === "health");
    assert.ok(healthTool, "Health tool should exist");
    const healthResult = await healthTool!.handler({});
    assert.ok(healthResult.content, "Health should return content");
    assert.strictEqual(healthResult.content[0].text, "ok");

    // Test gen.clientBasic
    const clientBasicTool = registeredTools.find(
      (t) => t.name === "gen.clientBasic",
    );
    assert.ok(clientBasicTool, "gen.clientBasic tool should exist");
    const clientResult = await clientBasicTool!.handler({});
    assert.ok(clientResult.content, "gen.clientBasic should return content");
    assert.ok(clientResult.content[0].text.includes("GlideClient"));

    // Test api.categories
    const categoriesTool = registeredTools.find(
      (t) => t.name === "api.categories",
    );
    assert.ok(categoriesTool, "api.categories tool should exist");
    const categoriesResult = await categoriesTool!.handler({});
    assert.ok(categoriesResult.content, "api.categories should return content");
    assert.ok(Array.isArray(JSON.parse(categoriesResult.content[0].text)));
  });

  await t.test("Tools with required parameters validate input", async () => {
    // Test gen.cache with parameters
    const cacheTool = registeredTools.find((t) => t.name === "gen.cache");
    assert.ok(cacheTool, "gen.cache tool should exist");
    const cacheResult = await cacheTool!.handler({
      key: "test-key",
      ttlSeconds: 60,
    });
    assert.ok(cacheResult.content, "gen.cache should return content");
    assert.ok(cacheResult.content[0].text.includes("test-key"));
    assert.ok(cacheResult.content[0].text.includes("60"));

    // Test gen.lock with parameters
    const lockTool = registeredTools.find((t) => t.name === "gen.lock");
    assert.ok(lockTool, "gen.lock tool should exist");
    const lockResult = await lockTool!.handler({
      lockKey: "mylock",
      ttlMs: 5000,
    });
    assert.ok(lockResult.content, "gen.lock should return content");
    assert.ok(lockResult.content[0].text.includes("mylock"));
    assert.ok(lockResult.content[0].text.includes("5000"));

    // Test api.findEquivalent
    const findEquivTool = registeredTools.find(
      (t) => t.name === "api.findEquivalent",
    );
    assert.ok(findEquivTool, "api.findEquivalent tool should exist");
    const equivResult = await findEquivTool!.handler({
      source: "ioredis",
      symbol: "get",
    });
    assert.ok(equivResult.content, "api.findEquivalent should return content");
    assert.ok(equivResult.content[0].text.includes("mapping"));
  });

  await t.test("Migration tool handles ioredis code", async () => {
    const migrateTool = registeredTools.find((t) => t.name === "migrate.naive");
    assert.ok(migrateTool, "migrate.naive tool should exist");

    const ioredisCode = `
import Redis from 'ioredis';
const redis = new Redis();
await redis.set('key', 'value');
const value = await redis.get('key');
`;

    const result = await migrateTool!.handler({
      from: "ioredis",
      code: ioredisCode,
    });

    assert.ok(result.content, "migrate.naive should return content");
    const migratedCode = result.content[0].text;
    assert.ok(migratedCode.includes("@valkey/valkey-glide"));
    assert.ok(migratedCode.includes("GlideClient"));
    assert.ok(!migratedCode.includes("new Redis"));
  });

  await t.test("Migration tool handles node-redis code", async () => {
    const migrateTool = registeredTools.find((t) => t.name === "migrate.naive");
    assert.ok(migrateTool, "migrate.naive tool should exist");

    const nodeRedisCode = `
import { createClient } from 'redis';
const client = createClient();
await client.connect();
await client.set('key', 'value');
const value = await client.get('key');
`;

    const result = await migrateTool!.handler({
      from: "node-redis",
      code: nodeRedisCode,
    });

    assert.ok(result.content, "migrate.naive should return content");
    const migratedCode = result.content[0].text;
    assert.ok(migratedCode.includes("@valkey/valkey-glide"));
    assert.ok(migratedCode.includes("GlideClient"));
    assert.ok(
      !migratedCode.includes("createClient()"),
      "Should not have createClient() pattern",
    );
  });

  await t.test("Verify tool detects issues", async () => {
    const verifyTool = registeredTools.find((t) => t.name === "verify.static");
    assert.ok(verifyTool, "verify.static tool should exist");

    const badCode = `
import Redis from 'ioredis';
const redis = new Redis();
`;

    const result = await verifyTool!.handler({ code: badCode });
    assert.ok(
      result.structuredContent,
      "verify.static should return structured content",
    );
    assert.ok(
      result.structuredContent.errors.length > 0,
      "Should detect errors",
    );
    assert.ok(
      result.structuredContent.issues.length > 0,
      "Should detect issues",
    );
  });

  await t.test("API search functionality works", async () => {
    const searchTool = registeredTools.find((t) => t.name === "api.search");
    assert.ok(searchTool, "api.search tool should exist");

    const result = await searchTool!.handler({ query: "pubsub" });
    assert.ok(result.content, "api.search should return content");
    const searchResults = JSON.parse(result.content[1].text);
    assert.ok(Array.isArray(searchResults), "Should return array of results");
    assert.ok(searchResults.length > 0, "Should find pubsub-related results");
  });

  await t.test("Generator tools produce valid GLIDE code", async () => {
    const generatorTools = [
      "gen.sets",
      "gen.zsets",
      "gen.streams",
      "gen.transaction",
      "gen.pipeline",
      "gen.geo",
      "gen.bitmaps",
      "gen.hll",
      "gen.json",
      "gen.scan",
    ];

    for (const toolName of generatorTools) {
      const tool = registeredTools.find((t) => t.name === toolName);
      assert.ok(tool, `${toolName} should exist`);

      const result = await tool!.handler({});
      assert.ok(result.content, `${toolName} should return content`);
      const code = result.content[0].text;

      // Validate generated code
      assert.ok(
        code.includes("@valkey/valkey-glide"),
        `${toolName} should import GLIDE`,
      );
      assert.ok(
        code.includes("GlideClient") || code.includes("GlideClusterClient"),
        `${toolName} should use GLIDE client`,
      );
      assert.ok(
        !code.includes("new Redis"),
        `${toolName} should not use ioredis constructor`,
      );
      assert.ok(
        !code.includes("createClient()"),
        `${toolName} should not use node-redis pattern`,
      );
    }
  });

  await t.test("Data enrichment tool works", async () => {
    const dataEnrichTool = registeredTools.find(
      (t) => t.name === "data.enrich",
    );
    assert.ok(dataEnrichTool, "data.enrich tool should exist");

    // We'll skip the actual fetch test since it requires network access
    // but we can test that the tool is registered and callable
    assert.ok(dataEnrichTool.handler, "data.enrich should have a handler");
  });

  await t.test("Docs tools are functional", async () => {
    const listSourcesTool = registeredTools.find(
      (t) => t.name === "docs.listSources",
    );
    assert.ok(listSourcesTool, "docs.listSources should exist");

    const result = await listSourcesTool!.handler({});
    assert.ok(result.content, "docs.listSources should return content");
    const sources = JSON.parse(result.content[0].text).sources;
    assert.ok(Array.isArray(sources), "Should return array of sources");
    assert.ok(sources.length > 0, "Should have documentation sources");
  });

  await t.test("Tool schemas are properly defined", () => {
    // Check that tools with parameters have proper input schemas
    const toolsWithParams = [
      { name: "gen.cache", expectedParams: ["key", "ttlSeconds"] },
      { name: "gen.lock", expectedParams: ["lockKey", "ttlMs"] },
      {
        name: "gen.rateLimiter",
        expectedParams: ["key", "points", "duration"],
      },
      { name: "api.findEquivalent", expectedParams: ["source", "symbol"] },
      { name: "migrate.naive", expectedParams: ["from", "code"] },
    ];

    for (const { name, expectedParams } of toolsWithParams) {
      const tool = registeredTools.find((t) => t.name === name);
      assert.ok(tool, `${name} should exist`);
      assert.ok(tool!.inputSchema, `${name} should have input schema`);

      // Verify the schema has the expected parameters
      const schema = tool!.inputSchema as any;
      if (schema && schema.shape) {
        const schemaKeys = Object.keys(schema.shape);
        for (const param of expectedParams) {
          assert.ok(
            schemaKeys.includes(param),
            `${name} schema should include parameter ${param}`,
          );
        }
      }
    }
  });
});

test("Server initialization and lifecycle", async () => {
  const mcp = new McpServer({ name: "lifecycle-test", version: "1.0.0" });

  // Register tools
  registerHealthTool(mcp);

  // Check initial state
  assert.ok(!mcp.isConnected(), "Server should not be connected initially");

  // List tools
  const tools = Object.keys((mcp as any)._registeredTools || {});
  assert.ok(tools.length > 0, "Should have registered tools");

  // Check health tool exists
  const healthToolExists = tools.includes("health");
  assert.ok(healthToolExists, "Health tool should be registered");
});

test("Error handling in tools", async () => {
  const mcp = new McpServer({ name: "error-test", version: "1.0.0" });
  registerVerifyTools(mcp);

  const registeredTools = (mcp as any)._registeredTools || {};
  const verifyTool = registeredTools["verify.static"];
  assert.ok(verifyTool, "verify.static should exist");

  // Test with empty code
  const result = await verifyTool.callback({ code: "" }, {});
  assert.ok(result.structuredContent, "Should handle empty code");
  assert.ok(result.structuredContent.warnings, "Should have warnings array");
});

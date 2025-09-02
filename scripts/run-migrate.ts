#!/usr/bin/env tsx
import { SmartMigrationEngine } from "../src/tools/core/migration-engine.js";
import fs from "node:fs";

async function run(code: string) {
  const engine = new SmartMigrationEngine();
  const from = (process.argv[3] as "ioredis" | "node-redis") || "ioredis";
  const args = { from, code };
  const context = {
    userIntent: "migration" as const,
    complexity: "advanced" as const,
    clientCapabilities: "full" as const,
    taskType: "transform" as const,
    hasParameters: true,
    patterns: [] as string[],
  };
  const res = await engine.execute(args, context);
  console.log(JSON.stringify(res, null, 2));
}

async function main() {
  const arg = process.argv[2] || "";
  let input: string;
  if (arg.startsWith("@")) {
    input = fs.readFileSync(arg.slice(1), "utf8");
  } else {
    input = arg || 'const numbers = [1,3];\nawait redis.del("k");';
  }
  await run(input);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

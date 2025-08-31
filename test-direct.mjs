#!/usr/bin/env node
import { z } from "zod";

// Test if Zod schemas work correctly
const schema = {
  source: z.enum(["ioredis", "node-redis"]).describe("Source client"),
  symbol: z.string().describe("Function or usage"),
};

console.log("Schema object:", schema);
console.log("Schema.source type:", schema.source.constructor.name);
console.log("Has parse:", typeof schema.source.parse === "function");
console.log("Has _parse:", "_parse" in schema.source);

// Test wrapping with z.object
const wrapped = z.object(schema);
console.log("\nWrapped schema:", wrapped.constructor.name);
console.log("Wrapped has parse:", typeof wrapped.parse === "function");

// Test parsing
try {
  const result = wrapped.parse({ source: "ioredis", symbol: "get" });
  console.log("\nParsing success:", result);
} catch (e) {
  console.error("\nParsing failed:", e.message);
}
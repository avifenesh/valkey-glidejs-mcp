#!/usr/bin/env node
/**
 * GLIDE MCP Command Documentation Verification
 * Verifies API mappings and command availability
 */

import { writeFileSync } from "fs";

const logMessage = (msg: string) => {
  console.error(msg);
  writeFileSync("commands.log", msg + "\n", { flag: "a" });
};

async function main() {
  logMessage("📋 Starting command documentation verification...");

  try {
    // Test API mappings functionality
    logMessage("🔍 Testing API mappings...");
    const {
      searchAll,
      findEquivalent,
      IOREDIS_DATASET,
      NODE_REDIS_DATASET,
      GLIDE_SURFACE,
    } = await import("../src/data/api/mappings.js");

    // Test search functionality
    const testQueries = ["get", "set", "del", "exists", "hget", "lpush"];
    const searchStats: any = {};

    for (const query of testQueries) {
      const results = searchAll(query);
      searchStats[query] = results.length;
      logMessage(`✅ Search "${query}": ${results.length} results`);
    }

    // Test equivalency mappings
    const mappingStats: any = { ioredis: {}, nodeRedis: {} };

    for (const query of testQueries) {
      const ioredisResults = findEquivalent("ioredis", query);
      const nodeRedisResults = findEquivalent("node-redis", query);
      mappingStats.ioredis[query] = ioredisResults.length;
      mappingStats.nodeRedis[query] = nodeRedisResults.length;
      logMessage(
        `✅ Mappings "${query}": ioredis=${ioredisResults.length}, node-redis=${nodeRedisResults.length}`,
      );
    }

    // Dataset size verification
    logMessage("📊 Dataset verification...");
    logMessage(`✅ IOREDIS_DATASET: ${IOREDIS_DATASET.length} entries`);
    logMessage(`✅ NODE_REDIS_DATASET: ${NODE_REDIS_DATASET.length} entries`);
    logMessage(`✅ GLIDE_SURFACE: ${GLIDE_SURFACE.length} entries`);

    const result = {
      timestamp: new Date().toISOString(),
      status: "SUCCESS",
      version: "0.7.0",
      datasets: {
        ioredis: IOREDIS_DATASET.length,
        nodeRedis: NODE_REDIS_DATASET.length,
        glide: GLIDE_SURFACE.length,
      },
      searchTests: searchStats,
      mappingTests: mappingStats,
      totalQueries: testQueries.length,
      message: "Command documentation verification completed",
    };

    writeFileSync(
      "commands-verification.json",
      JSON.stringify(result, null, 2),
    );
    logMessage("🎉 Command verification completed successfully!");
  } catch (error) {
    const errorResult = {
      timestamp: new Date().toISOString(),
      status: "ERROR",
      error: error.message,
    };

    writeFileSync("commands-error.json", JSON.stringify(errorResult, null, 2));
    logMessage(`❌ Command verification failed: ${error.message}`);
    process.exit(1);
  }
}

main();

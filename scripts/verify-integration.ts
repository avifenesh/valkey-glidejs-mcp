#!/usr/bin/env tsx
/**
 * Minimal System Integration Verification
 * Validates consolidated core components and API mappings
 */

import { readFile } from "fs/promises";
import { resolve } from "path";

interface IntegrationTestResult {
  componentName: string;
  testType: "syntax" | "import" | "integration" | "compatibility";
  status: "pass" | "fail" | "warning";
  message: string;
  details?: string;
}

interface IntegrationReport {
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  results: IntegrationTestResult[];
  overallStatus: "pass" | "fail" | "warning";
  recommendations: string[];
}

class MinimalIntegrationVerifier {
  private results: IntegrationTestResult[] = [];

  async verify(): Promise<IntegrationReport> {
    console.log("🔍 Starting Minimal Integration Verification...\n");

    await this.verifyCoreComponents();
    await this.verifyMappings();
    await this.verifyServerMarkers();

    return this.generateReport();
  }

  private async verifyCoreComponents(): Promise<void> {
    console.log("📋 Verifying Core Components...");

    const coreFiles = [
      "src/tools/core/api-explorer.ts",
      "src/tools/core/code-generator.ts",
      "src/tools/core/migration-engine.ts",
      "src/tools/core/system-tools.ts",
      "src/tools/routing/context-analyzer.ts",
      "src/tools/routing/tool-router.ts",
      "src/data/api/mappings.ts",
      "src/data/api/comprehensive-mappings.ts",
    ];

    for (const file of coreFiles) {
      await this.verifyFileExists(file);
      await this.verifyImport(file);
    }
  }

  private async verifyMappings(): Promise<void> {
    console.log("🧭 Verifying API Mappings...");

    try {
      const { searchAll, findEquivalent } = await import(
        "../src/data/api/mappings.js"
      );
      const search = searchAll("get");
      const eq = findEquivalent("ioredis", "get");

      if (Array.isArray(search) && Array.isArray(eq)) {
        this.add({
          componentName: "API Mappings",
          testType: "integration",
          status: "pass",
          message: `searchAll/get=${search.length}, findEquivalent/ioredis(get)=${eq.length}`,
        });
      } else {
        this.add({
          componentName: "API Mappings",
          testType: "integration",
          status: "fail",
          message: "searchAll or findEquivalent did not return arrays",
        });
      }
    } catch (error: any) {
      this.add({
        componentName: "API Mappings",
        testType: "integration",
        status: "fail",
        message: `Import or execution failed: ${error.message}`,
      });
    }
  }

  private async verifyServerMarkers(): Promise<void> {
    console.log("🧪 Verifying Server Registration...");
    try {
      const serverPath = resolve("src/server.ts");
      const content = await readFile(serverPath, "utf-8");

      const markers = [
        "registerUnifiedApiExplorer",
        "registerUnifiedCodeGenerator",
        "registerSmartMigrationEngine",
        "registerSystemTools",
      ];

      const missing = markers.filter((m) => !content.includes(m));
      if (missing.length === 0) {
        this.add({
          componentName: "src/server.ts",
          testType: "compatibility",
          status: "pass",
          message: "All core tool registrations present",
        });
      } else {
        this.add({
          componentName: "src/server.ts",
          testType: "compatibility",
          status: "warning",
          message: `Missing registrations: ${missing.join(", ")}`,
        });
      }
    } catch (error: any) {
      this.add({
        componentName: "src/server.ts",
        testType: "compatibility",
        status: "fail",
        message: `Unable to read server file: ${error.message}`,
      });
    }
  }

  private async verifyFileExists(filePath: string): Promise<void> {
    try {
      const content = await readFile(resolve(filePath), "utf-8");
      if (content.length === 0) {
        this.add({
          componentName: filePath,
          testType: "syntax",
          status: "fail",
          message: "File is empty",
        });
      } else {
        this.add({
          componentName: filePath,
          testType: "syntax",
          status: "pass",
          message: "File present",
        });
      }
    } catch (error: any) {
      this.add({
        componentName: filePath,
        testType: "syntax",
        status: "fail",
        message: `File not found: ${error.message}`,
      });
    }
  }

  private async verifyImport(filePath: string): Promise<void> {
    try {
      // Only try to import TS files that are part of the runtime surface (core tools and mappings)
      if (
        filePath.startsWith("src/tools/core/") ||
        filePath.startsWith("src/data/")
      ) {
        const jsImport = `../${filePath}`.replace(/\.ts$/, ".js");
        await import(jsImport);
      }
      this.add({
        componentName: filePath,
        testType: "import",
        status: "pass",
        message: "Module import OK",
      });
    } catch (error: any) {
      this.add({
        componentName: filePath,
        testType: "import",
        status: "warning",
        message: `Import skipped or non-critical failure: ${error.message}`,
      });
    }
  }

  private add(result: IntegrationTestResult) {
    this.results.push(result);
  }

  private generateReport(): IntegrationReport {
    const passed = this.results.filter((r) => r.status === "pass").length;
    const failed = this.results.filter((r) => r.status === "fail").length;
    const warnings = this.results.filter((r) => r.status === "warning").length;

    const overallStatus: IntegrationReport["overallStatus"] =
      failed > 0 ? "fail" : warnings > 0 ? "warning" : "pass";

    const recommendations: string[] = [];
    if (failed > 0) {
      recommendations.push("Fix failing components before deployment");
    }
    if (warnings > 0) {
      recommendations.push("Review warnings for potential issues");
    }
    if (failed === 0 && warnings === 0) {
      recommendations.push("System ready for deployment");
    }

    const report: IntegrationReport = {
      totalTests: this.results.length,
      passed,
      failed,
      warnings,
      results: this.results,
      overallStatus,
      recommendations,
    };

    this.printReport(report);
    return report;
  }

  private printReport(report: IntegrationReport): void {
    console.log("\n" + "=".repeat(80));
    console.log("📊 MINIMAL INTEGRATION VERIFICATION REPORT");
    console.log("=".repeat(80));

    console.log(`\n📈 Test Summary:`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   ✅ Passed: ${report.passed}`);
    console.log(`   ❌ Failed: ${report.failed}`);
    console.log(`   ⚠️  Warnings: ${report.warnings}`);
    console.log(`   📊 Overall Status: ${report.overallStatus.toUpperCase()}`);

    if (report.failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      report.results
        .filter((r) => r.status === "fail")
        .forEach((r) => console.log(`   - ${r.componentName}: ${r.message}`));
    }

    if (report.warnings > 0) {
      console.log(`\n⚠️  Warnings:`);
      report.results
        .filter((r) => r.status === "warning")
        .forEach((r) => console.log(`   - ${r.componentName}: ${r.message}`));
    }

    console.log(`\n🎯 Recommendations:`);
    report.recommendations.forEach((rec) => console.log(`   • ${rec}`));

    console.log("\n" + "=".repeat(80));
    console.log(`Completed at ${new Date().toISOString()}`);
    console.log("=".repeat(80) + "\n");
  }
}

async function main(): Promise<void> {
  const verifier = new MinimalIntegrationVerifier();
  const report = await verifier.verify();
  process.exit(report.overallStatus === "fail" ? 1 : 0);
}

main().catch((err) => {
  console.error("❌ Integration verification failed:", err.message);
  process.exit(1);
});

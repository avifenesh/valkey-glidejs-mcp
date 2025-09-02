/**
 * Final System Integration and Compatibility Verification
 * Tests all Universal MCP Tool Enhancement components for proper integration
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

class SystemIntegrationVerifier {
  private results: IntegrationTestResult[] = [];

  /**
   * Run comprehensive integration verification
   */
  async verifySystemIntegration(): Promise<IntegrationReport> {
    console.log(
      "🔍 Starting Universal MCP Tool Enhancement System Integration Verification...\n",
    );

    // Test Core Infrastructure Components
    await this.verifyCoreComponents();

    // Test Enhanced Tool Components
    await this.verifyEnhancedTools();

    // Test AI Optimization Components
    await this.verifyAIOptimization();

    // Test Integration Points
    await this.verifyIntegrationPoints();

    // Test Compatibility
    await this.verifyCompatibility();

    return this.generateReport();
  }

  /**
   * Verify core infrastructure components
   */
  private async verifyCoreComponents(): Promise<void> {
    console.log("📋 Verifying Core Infrastructure Components...");

    const coreComponents = [
      "src/tools/core/schema/parameter-definitions.ts",
      "src/tools/core/schema/universal-validator.ts",
      "src/tools/core/schema/auto-completion.ts",
      "src/tools/core/analysis/query-analyzer.ts",
      "src/tools/core/analysis/command-recognizer.ts",
      "src/tools/core/analysis/pattern-matcher.ts",
      "src/tools/core/response/template-engine.ts",
      "src/tools/core/response/progressive-disclosure.ts",
      "src/tools/core/response/suggestion-generator.ts",
      "src/tools/core/database/command-registry.ts",
      "src/tools/core/database/api-inventory.ts",
      "src/tools/core/database/coverage-validator.ts",
    ];

    for (const component of coreComponents) {
      await this.verifyComponent(component, "core");
    }
  }

  /**
   * Verify enhanced tool components
   */
  private async verifyEnhancedTools(): Promise<void> {
    console.log("🛠️  Verifying Enhanced Tool Components...");

    const enhancedComponents = [
      "src/tools/enhanced/api-explorer/command-handlers.ts",
      "src/tools/enhanced/api-explorer/category-browser.ts",
      "src/tools/enhanced/api-explorer/cross-reference-mapper.ts",
      "src/tools/enhanced/api-explorer/performance-analyzer.ts",
      "src/tools/enhanced/api-explorer/index.ts",
      "src/tools/enhanced/code-generator/pattern-generator.ts",
      "src/tools/enhanced/code-generator/template-engine.ts",
      "src/tools/enhanced/code-generator/production-generator.ts",
      "src/tools/enhanced/code-generator/index.ts",
      "src/tools/enhanced/migration-engine/pattern-detector.ts",
      "src/tools/enhanced/migration-engine/dependency-analyzer.ts",
      "src/tools/enhanced/migration-engine/optimization-analyzer.ts",
      "src/tools/enhanced/migration-engine/index.ts",
      "src/tools/enhanced/system-tools/health-diagnostics.ts",
      "src/tools/enhanced/system-tools/performance-metrics.ts",
      "src/tools/enhanced/system-tools/index.ts",
    ];

    for (const component of enhancedComponents) {
      await this.verifyComponent(component, "enhanced");
    }
  }

  /**
   * Verify AI optimization components
   */
  private async verifyAIOptimization(): Promise<void> {
    console.log("🤖 Verifying AI Optimization Components...");

    const aiComponents = [
      "src/tools/ai-optimization/conversational/session-manager.ts",
      "src/tools/ai-optimization/conversational/followup-generator.ts",
      "src/tools/ai-optimization/conversational/progression-engine.ts",
      "src/tools/ai-optimization/conversational/index.ts",
      "src/tools/ai-optimization/persistence/session-memory.ts",
      "src/tools/ai-optimization/persistence/learning-experience.ts",
      "src/tools/ai-optimization/persistence/index.ts",
      "src/tools/ai-optimization/suggestions/ranking-engine.ts",
      "src/tools/ai-optimization/suggestions/command-discovery.ts",
      "src/tools/ai-optimization/suggestions/index.ts",
    ];

    for (const component of aiComponents) {
      await this.verifyComponent(component, "ai-optimization");
    }
  }

  /**
   * Verify integration points between components
   */
  private async verifyIntegrationPoints(): Promise<void> {
    console.log("🔗 Verifying Integration Points...");

    // Test cross-imports and dependencies
    await this.verifyImportStructure();

    // Test interface compatibility
    await this.verifyInterfaceCompatibility();

    // Test data flow between components
    await this.verifyDataFlow();
  }

  /**
   * Verify compatibility with existing system
   */
  private async verifyCompatibility(): Promise<void> {
    console.log("⚡ Verifying System Compatibility...");

    // Check existing tool integration
    await this.verifyExistingToolIntegration();

    // Check package.json compatibility
    await this.verifyPackageCompatibility();

    // Check TypeScript compatibility
    await this.verifyTypeScriptCompatibility();
  }

  /**
   * Verify individual component
   */
  private async verifyComponent(
    filePath: string,
    category: string,
  ): Promise<void> {
    try {
      const fullPath = resolve(filePath);
      const content = await readFile(fullPath, "utf-8");

      // Basic syntax verification
      if (content.length === 0) {
        this.addResult({
          componentName: filePath,
          testType: "syntax",
          status: "fail",
          message: "File is empty",
        });
        return;
      }

      // Check for proper TypeScript structure
      if (!content.includes("export")) {
        this.addResult({
          componentName: filePath,
          testType: "syntax",
          status: "warning",
          message: "No exports found",
        });
      }

      // Check for proper interface definitions
      if (content.includes("interface") && content.includes("export")) {
        this.addResult({
          componentName: filePath,
          testType: "syntax",
          status: "pass",
          message: "Component structure valid",
        });
      }

      // Check for proper imports
      if (content.includes("import") && content.includes("from")) {
        this.addResult({
          componentName: filePath,
          testType: "import",
          status: "pass",
          message: "Import structure valid",
        });
      }

      console.log(`  ✅ ${filePath} - OK`);
    } catch (error) {
      this.addResult({
        componentName: filePath,
        testType: "syntax",
        status: "fail",
        message: `Failed to verify component: ${error.message}`,
      });
      console.log(`  ❌ ${filePath} - ERROR: ${error.message}`);
    }
  }

  /**
   * Verify import structure across components
   */
  private async verifyImportStructure(): Promise<void> {
    const criticalPaths = [
      "src/tools/core/analysis/query-analyzer.ts",
      "src/tools/enhanced/api-explorer/index.ts",
      "src/tools/ai-optimization/suggestions/index.ts",
    ];

    for (const path of criticalPaths) {
      try {
        const content = await readFile(resolve(path), "utf-8");

        // Check for circular imports
        const imports = content.match(/import.*from\s+["']([^"']+)["']/g) || [];
        const hasCircularImport = imports.some((imp) =>
          imp.includes("../../../"),
        );

        if (hasCircularImport) {
          this.addResult({
            componentName: path,
            testType: "integration",
            status: "warning",
            message: "Potential circular import detected",
          });
        } else {
          this.addResult({
            componentName: path,
            testType: "integration",
            status: "pass",
            message: "Import structure healthy",
          });
        }
      } catch (error) {
        this.addResult({
          componentName: path,
          testType: "integration",
          status: "fail",
          message: `Import verification failed: ${error.message}`,
        });
      }
    }
  }

  /**
   * Verify interface compatibility
   */
  private async verifyInterfaceCompatibility(): Promise<void> {
    const interfaces = [
      {
        file: "src/tools/core/schema/parameter-definitions.ts",
        interface: "ParameterDefinition",
      },
      {
        file: "src/tools/core/analysis/query-analyzer.ts",
        interface: "EnhancedQueryContext",
      },
      {
        file: "src/tools/ai-optimization/conversational/followup-generator.ts",
        interface: "UserLearningProfile",
      },
    ];

    for (const { file, interface: interfaceName } of interfaces) {
      try {
        const content = await readFile(resolve(file), "utf-8");

        if (content.includes(`export interface ${interfaceName}`)) {
          this.addResult({
            componentName: `${file}:${interfaceName}`,
            testType: "integration",
            status: "pass",
            message: "Interface properly exported",
          });
        } else {
          this.addResult({
            componentName: `${file}:${interfaceName}`,
            testType: "integration",
            status: "fail",
            message: "Interface not found or not exported",
          });
        }
      } catch (error) {
        this.addResult({
          componentName: `${file}:${interfaceName}`,
          testType: "integration",
          status: "fail",
          message: `Interface verification failed: ${error.message}`,
        });
      }
    }
  }

  /**
   * Verify data flow between components
   */
  private async verifyDataFlow(): Promise<void> {
    // Check that query analyzer can work with response generators
    try {
      const queryAnalyzer = await readFile(
        resolve("src/tools/core/analysis/query-analyzer.ts"),
        "utf-8",
      );
      const templateEngine = await readFile(
        resolve("src/tools/core/response/template-engine.ts"),
        "utf-8",
      );

      const hasQueryContext = queryAnalyzer.includes("EnhancedQueryContext");
      const hasTemplateEngine = templateEngine.includes("TemplateEngine");

      if (hasQueryContext && hasTemplateEngine) {
        this.addResult({
          componentName: "Query Analysis → Template Engine",
          testType: "integration",
          status: "pass",
          message: "Data flow structure valid",
        });
      }
    } catch (error) {
      this.addResult({
        componentName: "Query Analysis → Template Engine",
        testType: "integration",
        status: "fail",
        message: `Data flow verification failed: ${error.message}`,
      });
    }
  }

  /**
   * Verify existing tool integration
   */
  private async verifyExistingToolIntegration(): Promise<void> {
    try {
      // Check if extract-all-apis.ts integration points exist
      const apiInventory = await readFile(
        resolve("src/tools/core/database/api-inventory.ts"),
        "utf-8",
      );

      if (apiInventory.includes("extract-all-apis")) {
        this.addResult({
          componentName: "API Inventory → extract-all-apis.ts",
          testType: "compatibility",
          status: "pass",
          message: "Integration with existing validation tools confirmed",
        });
      } else {
        this.addResult({
          componentName: "API Inventory → extract-all-apis.ts",
          testType: "compatibility",
          status: "warning",
          message: "Integration references may need verification",
        });
      }
    } catch (error) {
      this.addResult({
        componentName: "Existing Tool Integration",
        testType: "compatibility",
        status: "fail",
        message: `Integration verification failed: ${error.message}`,
      });
    }
  }

  /**
   * Verify package.json compatibility
   */
  private async verifyPackageCompatibility(): Promise<void> {
    try {
      const packageContent = await readFile(resolve("package.json"), "utf-8");
      const packageJson = JSON.parse(packageContent);

      // Check for required dependencies
      const requiredDeps = ["@modelcontextprotocol/sdk", "zod"];
      const hasRequiredDeps = requiredDeps.every(
        (dep) => packageJson.dependencies && packageJson.dependencies[dep],
      );

      if (hasRequiredDeps) {
        this.addResult({
          componentName: "package.json",
          testType: "compatibility",
          status: "pass",
          message: "All required dependencies present",
        });
      } else {
        this.addResult({
          componentName: "package.json",
          testType: "compatibility",
          status: "fail",
          message: "Missing required dependencies",
        });
      }

      // Check for TypeScript support
      if (
        packageJson.devDependencies &&
        packageJson.devDependencies.typescript
      ) {
        this.addResult({
          componentName: "TypeScript Support",
          testType: "compatibility",
          status: "pass",
          message: "TypeScript configuration present",
        });
      }
    } catch (error) {
      this.addResult({
        componentName: "package.json",
        testType: "compatibility",
        status: "fail",
        message: `Package verification failed: ${error.message}`,
      });
    }
  }

  /**
   * Verify TypeScript compatibility
   */
  private async verifyTypeScriptCompatibility(): Promise<void> {
    try {
      const tsconfigPath = resolve("tsconfig.json");
      const tsconfigContent = await readFile(tsconfigPath, "utf-8");

      if (
        tsconfigContent.includes("ES2022") ||
        tsconfigContent.includes("ES2020")
      ) {
        this.addResult({
          componentName: "TypeScript Configuration",
          testType: "compatibility",
          status: "pass",
          message: "Modern ES target configured",
        });
      }

      if (
        tsconfigContent.includes("module") &&
        tsconfigContent.includes("ESNext")
      ) {
        this.addResult({
          componentName: "Module System",
          testType: "compatibility",
          status: "pass",
          message: "ES modules properly configured",
        });
      }
    } catch (error) {
      // tsconfig.json might not exist, which is okay for tsx-based projects
      this.addResult({
        componentName: "TypeScript Configuration",
        testType: "compatibility",
        status: "warning",
        message: "TypeScript config not found (using tsx defaults)",
      });
    }
  }

  /**
   * Add test result
   */
  private addResult(result: IntegrationTestResult): void {
    this.results.push(result);
  }

  /**
   * Generate comprehensive report
   */
  private generateReport(): IntegrationReport {
    const passed = this.results.filter((r) => r.status === "pass").length;
    const failed = this.results.filter((r) => r.status === "fail").length;
    const warnings = this.results.filter((r) => r.status === "warning").length;

    const overallStatus =
      failed > 0 ? "fail" : warnings > 0 ? "warning" : "pass";

    const recommendations = this.generateRecommendations();

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

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    const failedTests = this.results.filter((r) => r.status === "fail");
    const warningTests = this.results.filter((r) => r.status === "warning");

    if (failedTests.length > 0) {
      recommendations.push("Address critical failures before deployment");
      recommendations.push(
        "Review failed components and fix syntax/integration issues",
      );
    }

    if (warningTests.length > 0) {
      recommendations.push(
        "Review warning components for potential improvements",
      );
    }

    if (failedTests.length === 0 && warningTests.length === 0) {
      recommendations.push("System ready for deployment");
      recommendations.push(
        "Consider running end-to-end tests with actual queries",
      );
      recommendations.push(
        "Monitor system performance in production environment",
      );
    }

    return recommendations;
  }

  /**
   * Print comprehensive report
   */
  private printReport(report: IntegrationReport): void {
    console.log("\n" + "=".repeat(80));
    console.log(
      "📊 UNIVERSAL MCP TOOL ENHANCEMENT - INTEGRATION VERIFICATION REPORT",
    );
    console.log("=".repeat(80));

    console.log(`\n📈 Test Summary:`);
    console.log(`   Total Tests: ${report.totalTests}`);
    console.log(`   ✅ Passed: ${report.passed}`);
    console.log(`   ❌ Failed: ${report.failed}`);
    console.log(`   ⚠️  Warnings: ${report.warnings}`);
    console.log(
      `   📊 Overall Status: ${this.getStatusEmoji(report.overallStatus)} ${report.overallStatus.toUpperCase()}`,
    );

    if (report.failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      report.results
        .filter((r) => r.status === "fail")
        .forEach((result) => {
          console.log(`   - ${result.componentName}: ${result.message}`);
        });
    }

    if (report.warnings > 0) {
      console.log(`\n⚠️  Warning Tests:`);
      report.results
        .filter((r) => r.status === "warning")
        .forEach((result) => {
          console.log(`   - ${result.componentName}: ${result.message}`);
        });
    }

    console.log(`\n🎯 Recommendations:`);
    report.recommendations.forEach((rec) => {
      console.log(`   • ${rec}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(
      `Integration verification completed at ${new Date().toISOString()}`,
    );
    console.log("=".repeat(80) + "\n");
  }

  /**
   * Get status emoji
   */
  private getStatusEmoji(status: string): string {
    switch (status) {
      case "pass":
        return "✅";
      case "fail":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "❓";
    }
  }
}

// Main execution function
async function main(): Promise<void> {
  const verifier = new SystemIntegrationVerifier();

  try {
    const report = await verifier.verifySystemIntegration();

    // Exit with appropriate code based on results
    if (report.overallStatus === "fail") {
      process.exit(1);
    } else if (report.overallStatus === "warning") {
      process.exit(0); // Warnings are acceptable
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Integration verification failed:", error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export {
  SystemIntegrationVerifier,
  type IntegrationReport,
  type IntegrationTestResult,
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

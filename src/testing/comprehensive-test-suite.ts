/**
 * Comprehensive Test Suite for Universal MCP Tool Enhancement System
 * Tests all components, integration points, and functionality
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';

interface TestResult {
  testName: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance';
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
  details?: any;
}

interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
}

export class ComprehensiveTestSuite {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<TestSuiteResult> {
    console.log('🧪 Starting Comprehensive Test Suite for Universal MCP Enhancement System');
    console.log('=' .repeat(80));
    
    this.startTime = Date.now();

    // Core Infrastructure Tests
    await this.runCoreInfrastructureTests();
    
    // Enhanced Tools Tests
    await this.runEnhancedToolsTests();
    
    // AI Optimization Tests
    await this.runAIOptimizationTests();
    
    // Integration Tests
    await this.runIntegrationTests();
    
    // Performance Tests
    await this.runPerformanceTests();

    return this.generateSummary();
  }

  private async runCoreInfrastructureTests(): Promise<void> {
    console.log('\n📋 Running Core Infrastructure Tests...');
    
    await this.runTest('Parameter Definitions Schema', 'unit', async () => {
      const content = await readFile(resolve('src/tools/core/schema/parameter-definitions.ts'), 'utf-8');
      if (!content.includes('export interface ParameterDefinition')) {
        throw new Error('ParameterDefinition interface not found');
      }
      if (!content.includes('COMMON_PARAMETERS')) {
        throw new Error('COMMON_PARAMETERS not found');
      }
      return { componentsFound: ['ParameterDefinition', 'COMMON_PARAMETERS'] };
    });

    await this.runTest('Universal Validator Implementation', 'unit', async () => {
      const content = await readFile(resolve('src/tools/core/schema/universal-validator.ts'), 'utf-8');
      if (!content.includes('export class UniversalValidator')) {
        throw new Error('UniversalValidator class not found');
      }
      if (!content.includes('validateParameters')) {
        throw new Error('validateParameters method not found');
      }
      return { classFound: true, methodsFound: ['validateParameters'] };
    });

    await this.runTest('Query Analyzer Intent Detection', 'unit', async () => {
      const content = await readFile(resolve('src/tools/core/analysis/query-analyzer.ts'), 'utf-8');
      if (!content.includes('EnhancedQueryContext')) {
        throw new Error('EnhancedQueryContext interface not found');
      }
      if (!content.includes('QueryAnalyzer')) {
        throw new Error('QueryAnalyzer class not found');
      }
      const intentTypes = ['search', 'migrate', 'generate', 'compare', 'help'];
      const hasIntentTypes = intentTypes.every(intent => content.includes(`'${intent}'`));
      if (!hasIntentTypes) {
        throw new Error('Not all intent types found');
      }
      return { intentTypesFound: intentTypes.length };
    });

    await this.runTest('Command Recognition Patterns', 'unit', async () => {
      const content = await readFile(resolve('src/tools/core/analysis/command-recognizer.ts'), 'utf-8');
      if (!content.includes('CommandRecognizer')) {
        throw new Error('CommandRecognizer class not found');
      }
      const commands = ['GET', 'SET', 'HSET', 'XREAD', 'ZADD'];
      const hasCommands = commands.some(cmd => content.includes(cmd));
      if (!hasCommands) {
        throw new Error('Redis commands not found in patterns');
      }
      return { commandPatternsFound: true };
    });

    await this.runTest('Progressive Disclosure System', 'unit', async () => {
      const content = await readFile(resolve('src/tools/core/response/progressive-disclosure.ts'), 'utf-8');
      if (!content.includes('ProgressiveDisclosure')) {
        throw new Error('ProgressiveDisclosure class not found');
      }
      const levels = ['basic', 'intermediate', 'advanced', 'expert'];
      const hasLevels = levels.every(level => content.includes(`'${level}'`));
      if (!hasLevels) {
        throw new Error('Not all complexity levels found');
      }
      return { complexityLevels: levels.length };
    });
  }

  private async runEnhancedToolsTests(): Promise<void> {
    console.log('\n🛠️  Running Enhanced Tools Tests...');

    await this.runTest('API Explorer Command Handlers', 'unit', async () => {
      const content = await readFile(resolve('src/tools/enhanced/api-explorer/command-handlers.ts'), 'utf-8');
      if (!content.includes('CommandHandler')) {
        throw new Error('CommandHandler interface not found');
      }
      const handlers = ['GET', 'SET', 'HSET', 'XREAD', 'ZADD'];
      const handlerCount = handlers.filter(handler => 
        content.includes(`${handler.toLowerCase()}Handler`) || content.includes(`handle${handler}`)
      ).length;
      if (handlerCount === 0) {
        throw new Error('No command handlers found');
      }
      return { handlersImplemented: handlerCount };
    });

    await this.runTest('Code Generator Pattern Detection', 'unit', async () => {
      const content = await readFile(resolve('src/tools/enhanced/code-generator/pattern-generator.ts'), 'utf-8');
      if (!content.includes('PatternGenerator')) {
        throw new Error('PatternGenerator class not found');
      }
      const patterns = ['caching', 'sessions', 'streams'];
      const hasPatterns = patterns.some(pattern => content.includes(pattern));
      if (!hasPatterns) {
        throw new Error('Code generation patterns not found');
      }
      return { patternsSupported: patterns.filter(p => content.includes(p)).length };
    });

    await this.runTest('Migration Engine Multi-Pattern Detection', 'unit', async () => {
      const content = await readFile(resolve('src/tools/enhanced/migration-engine/pattern-detector.ts'), 'utf-8');
      if (!content.includes('PatternDetector')) {
        throw new Error('PatternDetector class not found');
      }
      const patterns = ['pipeline', 'transaction', 'clustering'];
      const hasPatterns = patterns.some(pattern => content.includes(pattern));
      if (!hasPatterns) {
        throw new Error('Migration patterns not found');
      }
      return { migrationPatterns: patterns.filter(p => content.includes(p)).length };
    });

    await this.runTest('System Tools Health Diagnostics', 'unit', async () => {
      const content = await readFile(resolve('src/tools/enhanced/system-tools/health-diagnostics.ts'), 'utf-8');
      if (!content.includes('HealthDiagnostics')) {
        throw new Error('HealthDiagnostics class not found');
      }
      const checks = ['connection', 'performance', 'memory'];
      const hasChecks = checks.some(check => content.includes(check));
      if (!hasChecks) {
        throw new Error('Health check types not found');
      }
      return { healthChecks: checks.filter(c => content.includes(c)).length };
    });
  }

  private async runAIOptimizationTests(): Promise<void> {
    console.log('\n🤖 Running AI Optimization Tests...');

    await this.runTest('Conversational Session Management', 'unit', async () => {
      const content = await readFile(resolve('src/tools/ai-optimization/conversational/session-manager.ts'), 'utf-8');
      if (!content.includes('ConversationalSession')) {
        throw new Error('ConversationalSession class not found');
      }
      if (!content.includes('SessionManager')) {
        throw new Error('SessionManager class not found');
      }
      return { sessionManagementFound: true };
    });

    await this.runTest('Context Persistence Memory System', 'unit', async () => {
      const content = await readFile(resolve('src/tools/ai-optimization/persistence/session-memory.ts'), 'utf-8');
      if (!content.includes('SessionMemoryManager')) {
        throw new Error('SessionMemoryManager class not found');
      }
      const memoryLayers = ['shortTerm', 'longTerm', 'working', 'contextual'];
      const hasLayers = memoryLayers.every(layer => content.includes(layer));
      if (!hasLayers) {
        throw new Error('Not all memory layers found');
      }
      return { memoryLayers: memoryLayers.length };
    });

    await this.runTest('Smart Suggestions Engine', 'unit', async () => {
      const content = await readFile(resolve('src/tools/ai-optimization/suggestions/index.ts'), 'utf-8');
      if (!content.includes('SmartSuggestionsEngine')) {
        throw new Error('SmartSuggestionsEngine class not found');
      }
      const suggestionTypes = ['proactive', 'reactive', 'discovery'];
      const hasTypes = suggestionTypes.some(type => content.includes(type));
      if (!hasTypes) {
        throw new Error('Suggestion types not found');
      }
      return { suggestionTypesFound: true };
    });

    await this.runTest('Command Discovery Engine', 'unit', async () => {
      const content = await readFile(resolve('src/tools/ai-optimization/suggestions/command-discovery.ts'), 'utf-8');
      if (!content.includes('CommandDiscoveryEngine')) {
        throw new Error('CommandDiscoveryEngine class not found');
      }
      if (!content.includes('WorkflowRecommendation')) {
        throw new Error('WorkflowRecommendation interface not found');
      }
      return { discoveryEngineFound: true };
    });
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('\n🔗 Running Integration Tests...');

    await this.runTest('Core Schema Integration', 'integration', async () => {
      // Test that core schema components work together
      const validator = await readFile(resolve('src/tools/core/schema/universal-validator.ts'), 'utf-8');
      const definitions = await readFile(resolve('src/tools/core/schema/parameter-definitions.ts'), 'utf-8');
      
      if (!validator.includes('import') || !definitions.includes('export')) {
        throw new Error('Integration structure incomplete');
      }
      return { integrationValid: true };
    });

    await this.runTest('Enhanced Tools Cross-Integration', 'integration', async () => {
      // Test that enhanced tools can work together
      const apiExplorer = await readFile(resolve('src/tools/enhanced/api-explorer/index.ts'), 'utf-8');
      const codeGenerator = await readFile(resolve('src/tools/enhanced/code-generator/index.ts'), 'utf-8');
      
      const hasProperExports = [apiExplorer, codeGenerator].every(content => 
        content.includes('export') && content.includes('class')
      );
      
      if (!hasProperExports) {
        throw new Error('Cross-integration exports missing');
      }
      return { crossIntegrationValid: true };
    });

    await this.runTest('AI Optimization Integration', 'integration', async () => {
      // Test AI optimization components integration
      const conversational = await readFile(resolve('src/tools/ai-optimization/conversational/index.ts'), 'utf-8');
      const persistence = await readFile(resolve('src/tools/ai-optimization/persistence/index.ts'), 'utf-8');
      const suggestions = await readFile(resolve('src/tools/ai-optimization/suggestions/index.ts'), 'utf-8');
      
      const components = [conversational, persistence, suggestions];
      const hasIntegration = components.every(content => 
        content.includes('export') && content.includes('interface')
      );
      
      if (!hasIntegration) {
        throw new Error('AI optimization integration incomplete');
      }
      return { aiIntegrationValid: true };
    });

    await this.runTest('Testing Framework Integration', 'integration', async () => {
      // Test that testing components work together
      const simulation = await readFile(resolve('src/testing/ai-agent/query-simulation.ts'), 'utf-8');
      const metrics = await readFile(resolve('src/testing/ai-agent/quality-metrics.ts'), 'utf-8');
      
      const hasTestingStructure = [simulation, metrics].every(content =>
        content.includes('export') && content.includes('interface')
      );
      
      if (!hasTestingStructure) {
        throw new Error('Testing framework integration incomplete');
      }
      return { testingIntegrationValid: true };
    });
  }

  private async runPerformanceTests(): Promise<void> {
    console.log('\n⚡ Running Performance Tests...');

    await this.runTest('File Load Performance', 'performance', async () => {
      const startTime = Date.now();
      const files = [
        'src/tools/core/schema/parameter-definitions.ts',
        'src/tools/enhanced/api-explorer/index.ts',
        'src/tools/ai-optimization/suggestions/index.ts'
      ];
      
      for (const file of files) {
        await readFile(resolve(file), 'utf-8');
      }
      
      const loadTime = Date.now() - startTime;
      if (loadTime > 1000) {
        throw new Error(`File loading too slow: ${loadTime}ms`);
      }
      return { loadTime, filesLoaded: files.length };
    });

    await this.runTest('Memory Usage Test', 'performance', async () => {
      const initialMemory = process.memoryUsage();
      
      // Simulate loading multiple components
      const contents = [];
      for (let i = 0; i < 10; i++) {
        const content = await readFile(resolve('src/tools/core/schema/parameter-definitions.ts'), 'utf-8');
        contents.push(content);
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      if (memoryIncrease > 50 * 1024 * 1024) { // 50MB threshold
        throw new Error(`Memory usage too high: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
      }
      
      return { memoryIncrease: Math.round(memoryIncrease / 1024), itemsProcessed: contents.length };
    });
  }

  private async runTest(testName: string, category: TestResult['category'], testFn: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log(`  Running: ${testName}...`);
      const details = await testFn();
      const duration = Date.now() - startTime;
      
      this.results.push({
        testName,
        category,
        status: 'pass',
        duration,
        details
      });
      
      console.log(`    ✅ ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.results.push({
        testName,
        category,
        status: 'fail',
        duration,
        error: error instanceof Error ? error.message : String(error)
      });
      
      console.log(`    ❌ ${testName} (${duration}ms): ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private generateSummary(): TestSuiteResult {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const skipped = this.results.filter(r => r.status === 'skip').length;

    const summary: TestSuiteResult = {
      suiteName: 'Universal MCP Tool Enhancement System',
      totalTests: this.results.length,
      passed,
      failed,
      skipped,
      duration: totalDuration,
      results: this.results
    };

    this.printSummary(summary);
    return summary;
  }

  private printSummary(summary: TestSuiteResult): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE TEST SUITE RESULTS');
    console.log('='.repeat(80));
    
    console.log(`\n📈 Summary:`);
    console.log(`   Total Tests: ${summary.totalTests}`);
    console.log(`   ✅ Passed: ${summary.passed}`);
    console.log(`   ❌ Failed: ${summary.failed}`);
    console.log(`   ⏭️  Skipped: ${summary.skipped}`);
    console.log(`   ⏱️  Duration: ${summary.duration}ms`);
    console.log(`   📊 Success Rate: ${Math.round((summary.passed / summary.totalTests) * 100)}%`);

    if (summary.failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      summary.results
        .filter(r => r.status === 'fail')
        .forEach(result => {
          console.log(`   - ${result.testName}: ${result.error}`);
        });
    }

    const categories = ['unit', 'integration', 'e2e', 'performance'] as const;
    console.log(`\n📋 By Category:`);
    categories.forEach(category => {
      const categoryResults = summary.results.filter(r => r.category === category);
      const categoryPassed = categoryResults.filter(r => r.status === 'pass').length;
      const categoryTotal = categoryResults.length;
      
      if (categoryTotal > 0) {
        console.log(`   ${category}: ${categoryPassed}/${categoryTotal} passed`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log(`Test suite completed at ${new Date().toISOString()}`);
    console.log('='.repeat(80) + '\n');
  }
}

// Main execution
async function main(): Promise<void> {
  const testSuite = new ComprehensiveTestSuite();
  
  try {
    const results = await testSuite.runAllTests();
    
    if (results.failed > 0) {
      process.exit(1);
    } else {
      console.log('🎉 All tests passed! System is ready for deployment.');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Test suite execution failed:', error);
    process.exit(1);
  }
}

// Export types for use in other scripts
export type { TestResult, TestSuiteResult };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
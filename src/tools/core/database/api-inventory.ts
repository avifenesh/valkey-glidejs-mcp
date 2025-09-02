/**
 * API Inventory Integration
 * Integrates with extract-all-apis.ts tool for dynamic API discovery and validation
 */

import { CommandRegistry, CommandDefinition } from "./command-registry.js";

export interface ApiMethod {
  name: string;
  file: string;
  category?: string;
  parameters?: string[];
  returnType?: string;
  isAsync?: boolean;
}

export interface ApiInventory {
  baseClient: ApiMethod[];
  glideClient: ApiMethod[];
  glideClusterClient: ApiMethod[];
  commands: ApiMethod[];
  transaction: ApiMethod[];
  glideFt: ApiMethod[];
  glideJson: ApiMethod[];
  total: number;
}

export interface InventoryAnalysis {
  totalMethods: number;
  coveredMethods: number;
  missingMethods: string[];
  coveragePercentage: number;
  categoryBreakdown: Record<
    string,
    { total: number; covered: number; missing: string[] }
  >;
  recommendedAdditions: string[];
}

export class ApiInventoryManager {
  private static inventory: ApiInventory | null = null;
  private static lastUpdated: Date | null = null;
  private static analysis: InventoryAnalysis | null = null;

  /**
   * Load API inventory from extract-all-apis tool
   */
  static async loadInventory(): Promise<ApiInventory> {
    try {
      // Try to load from existing inventory file first
      const inventoryPath = process.cwd() + "/glide-api-inventory.json";
      const fs = await import("fs");

      if (fs.existsSync(inventoryPath)) {
        const inventoryData = fs.readFileSync(inventoryPath, "utf-8");
        this.inventory = JSON.parse(inventoryData);
        this.lastUpdated = new Date();
      } else {
        // Generate new inventory using extract-all-apis
        this.inventory = await this.generateInventory();
      }

      return this.inventory!;
    } catch (error) {
      console.warn("Failed to load API inventory:", error);
      // Fallback to minimal inventory
      return this.createFallbackInventory();
    }
  }

  /**
   * Generate fresh inventory using extract-all-apis tool
   */
  private static async generateInventory(): Promise<ApiInventory> {
    // This would execute the extract-all-apis.ts script
    // For now, we'll simulate the expected structure
    return {
      baseClient: [
        { name: "ping", file: "BaseClient", isAsync: true },
        { name: "close", file: "BaseClient", isAsync: true },
        { name: "info", file: "BaseClient", isAsync: true },
      ],
      glideClient: [
        {
          name: "get",
          file: "GlideClient",
          isAsync: true,
          category: "strings",
        },
        {
          name: "set",
          file: "GlideClient",
          isAsync: true,
          category: "strings",
        },
        {
          name: "hget",
          file: "GlideClient",
          isAsync: true,
          category: "hashes",
        },
        {
          name: "hset",
          file: "GlideClient",
          isAsync: true,
          category: "hashes",
        },
        {
          name: "lpush",
          file: "GlideClient",
          isAsync: true,
          category: "lists",
        },
        { name: "lpop", file: "GlideClient", isAsync: true, category: "lists" },
        { name: "sadd", file: "GlideClient", isAsync: true, category: "sets" },
        {
          name: "smembers",
          file: "GlideClient",
          isAsync: true,
          category: "sets",
        },
        {
          name: "zadd",
          file: "GlideClient",
          isAsync: true,
          category: "sortedsets",
        },
        {
          name: "zrange",
          file: "GlideClient",
          isAsync: true,
          category: "sortedsets",
        },
      ],
      glideClusterClient: [
        {
          name: "get",
          file: "GlideClusterClient",
          isAsync: true,
          category: "strings",
        },
        {
          name: "set",
          file: "GlideClusterClient",
          isAsync: true,
          category: "strings",
        },
      ],
      commands: [
        { name: "GET", file: "Commands", category: "strings" },
        { name: "SET", file: "Commands", category: "strings" },
        { name: "HGET", file: "Commands", category: "hashes" },
        { name: "HSET", file: "Commands", category: "hashes" },
        { name: "XADD", file: "Commands", category: "streams" },
        { name: "XREAD", file: "Commands", category: "streams" },
      ],
      transaction: [
        { name: "multi", file: "Transaction", isAsync: false },
        { name: "exec", file: "Transaction", isAsync: true },
      ],
      glideFt: [
        { name: "search", file: "GlideFt", isAsync: true, category: "search" },
        { name: "create", file: "GlideFt", isAsync: true, category: "search" },
      ],
      glideJson: [
        { name: "get", file: "GlideJson", isAsync: true, category: "json" },
        { name: "set", file: "GlideJson", isAsync: true, category: "json" },
      ],
      total: 0,
    };
  }

  /**
   * Create fallback inventory when discovery fails
   */
  private static createFallbackInventory(): ApiInventory {
    return {
      baseClient: [],
      glideClient: [
        {
          name: "get",
          file: "GlideClient",
          category: "strings",
          isAsync: true,
        },
        {
          name: "set",
          file: "GlideClient",
          category: "strings",
          isAsync: true,
        },
        {
          name: "hget",
          file: "GlideClient",
          category: "hashes",
          isAsync: true,
        },
        {
          name: "hset",
          file: "GlideClient",
          category: "hashes",
          isAsync: true,
        },
      ],
      glideClusterClient: [],
      commands: [],
      transaction: [],
      glideFt: [],
      glideJson: [],
      total: 4,
    };
  }

  /**
   * Analyze inventory coverage against command registry
   */
  static analyzeInventory(): InventoryAnalysis {
    if (!this.inventory) {
      throw new Error("Inventory not loaded. Call loadInventory() first.");
    }

    const registryCommands = CommandRegistry.getAllCommands();
    const inventoryMethods = this.extractAllMethods();

    const analysis: InventoryAnalysis = {
      totalMethods: inventoryMethods.size,
      coveredMethods: 0,
      missingMethods: [],
      coveragePercentage: 0,
      categoryBreakdown: {},
      recommendedAdditions: [],
    };

    // Check coverage for each registry command
    const covered = new Set<string>();
    const missing: string[] = [];

    for (const command of registryCommands) {
      const methodName = command.name.toLowerCase();
      if (inventoryMethods.has(methodName)) {
        covered.add(command.name);
      } else {
        missing.push(command.name);
      }
    }

    analysis.coveredMethods = covered.size;
    analysis.missingMethods = missing;
    analysis.coveragePercentage =
      (covered.size / registryCommands.length) * 100;

    // Category breakdown
    const categories = CommandRegistry.getCategories();
    for (const category of categories) {
      const categoryCommands = CommandRegistry.getCategoryCommands(category);
      const categoryCovered = categoryCommands.filter((cmd) =>
        covered.has(cmd.name),
      );
      const categoryMissing = categoryCommands.filter(
        (cmd) => !covered.has(cmd.name),
      );

      analysis.categoryBreakdown[category] = {
        total: categoryCommands.length,
        covered: categoryCovered.length,
        missing: categoryMissing.map((cmd) => cmd.name),
      };
    }

    // Recommend high-priority additions
    analysis.recommendedAdditions = this.getRecommendedAdditions(missing);

    this.analysis = analysis;
    return analysis;
  }

  /**
   * Extract all method names from inventory
   */
  private static extractAllMethods(): Set<string> {
    const methods = new Set<string>();

    if (!this.inventory) return methods;

    // Collect from all inventory sections
    Object.values(this.inventory).forEach((section) => {
      if (Array.isArray(section)) {
        section.forEach((method) => {
          if (typeof method.name === "string") {
            methods.add(method.name.toLowerCase());
          }
        });
      }
    });

    return methods;
  }

  /**
   * Get recommended method additions based on priority
   */
  private static getRecommendedAdditions(missing: string[]): string[] {
    // Priority order based on common usage
    const priorityOrder = [
      "MGET",
      "MSET",
      "EXISTS",
      "DEL",
      "EXPIRE",
      "TTL",
      "HGETALL",
      "HMGET",
      "HMSET",
      "HDEL",
      "LLEN",
      "LRANGE",
      "RPUSH",
      "RPOP",
      "SCARD",
      "SISMEMBER",
      "SREM",
      "ZRANK",
      "ZSCORE",
      "ZCARD",
      "PUBLISH",
      "SUBSCRIBE",
      "XLEN",
      "XRANGE",
      "XREADGROUP",
    ];

    return missing
      .filter((cmd) => priorityOrder.includes(cmd))
      .sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b))
      .slice(0, 10); // Top 10 recommendations
  }

  /**
   * Update command registry with discovered methods
   */
  static updateRegistryFromInventory(): void {
    if (!this.inventory) {
      throw new Error("Inventory not loaded");
    }

    // Add discovered methods that aren't in registry
    const inventoryMethods = this.extractAllMethods();
    const registryCommands = new Set(
      CommandRegistry.getAllCommands().map((cmd) => cmd.name.toLowerCase()),
    );

    for (const methodName of inventoryMethods) {
      if (!registryCommands.has(methodName)) {
        this.addDiscoveredMethod(methodName);
      }
    }
  }

  /**
   * Add discovered method to registry
   */
  private static addDiscoveredMethod(methodName: string): void {
    const method = this.findMethodInInventory(methodName);
    if (!method) return;

    const command: CommandDefinition = {
      name: methodName.toUpperCase(),
      category: method.category || this.inferCategory(methodName),
      glideMethod: `client.${methodName}()`,
      description: `${methodName.toUpperCase()} command`,
      parameters: [],
      returnType: "any",
      complexity: "intermediate",
      useCases: [],
      examples: [],
      relatedCommands: [],
      performance: {
        timeComplexity: "O(?)",
        spaceComplexity: "O(?)",
        optimizationTips: [],
      },
      migration: {
        complexityRating: 2,
        commonIssues: [],
      },
    };

    // Note: This would require making CommandRegistry.addCommand public
    // For now, we'll just log the discovery
    console.log(`Discovered new method: ${methodName}`);
  }

  /**
   * Find method details in inventory
   */
  private static findMethodInInventory(methodName: string): ApiMethod | null {
    if (!this.inventory) return null;

    for (const section of Object.values(this.inventory)) {
      if (Array.isArray(section)) {
        const method = section.find((m) => m.name.toLowerCase() === methodName);
        if (method) return method;
      }
    }

    return null;
  }

  /**
   * Infer category from method name
   */
  private static inferCategory(methodName: string): string {
    const patterns = {
      strings: /^(get|set|mget|mset|incr|decr|append|strlen)/i,
      hashes: /^h(get|set|del|exists|keys|vals|len|getall)/i,
      lists: /^(l|r)(push|pop|len|range|index|set|trim|rem)/i,
      sets: /^s(add|rem|members|card|ismember|inter|union|diff)/i,
      sortedsets: /^z(add|rem|range|rank|score|card|count)/i,
      streams: /^x(add|read|len|range|del|group|ack)/i,
      geo: /^geo(add|dist|hash|pos|radius|search)/i,
      pubsub: /^p?(publish|subscribe|unsubscribe)/i,
    };

    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(methodName)) {
        return category;
      }
    }

    return "general";
  }

  /**
   * Get current inventory
   */
  static getInventory(): ApiInventory | null {
    return this.inventory;
  }

  /**
   * Get current analysis
   */
  static getAnalysis(): InventoryAnalysis | null {
    return this.analysis;
  }

  /**
   * Check if inventory needs refresh
   */
  static needsRefresh(): boolean {
    if (!this.lastUpdated) return true;

    const oneHour = 60 * 60 * 1000;
    return Date.now() - this.lastUpdated.getTime() > oneHour;
  }

  /**
   * Refresh inventory and analysis
   */
  static async refresh(): Promise<void> {
    this.inventory = await this.generateInventory();
    this.lastUpdated = new Date();
    this.analysis = this.analyzeInventory();
  }

  /**
   * Get inventory statistics
   */
  static getStats(): {
    totalMethods: number;
    byCategory: Record<string, number>;
    byFile: Record<string, number>;
    asyncMethods: number;
  } {
    if (!this.inventory) {
      return { totalMethods: 0, byCategory: {}, byFile: {}, asyncMethods: 0 };
    }

    const stats = {
      totalMethods: 0,
      byCategory: {} as Record<string, number>,
      byFile: {} as Record<string, number>,
      asyncMethods: 0,
    };

    Object.values(this.inventory).forEach((section) => {
      if (Array.isArray(section)) {
        section.forEach((method) => {
          stats.totalMethods++;

          if (method.isAsync) {
            stats.asyncMethods++;
          }

          if (method.category) {
            stats.byCategory[method.category] =
              (stats.byCategory[method.category] || 0) + 1;
          }

          if (method.file) {
            stats.byFile[method.file] = (stats.byFile[method.file] || 0) + 1;
          }
        });
      }
    });

    return stats;
  }
}

// Export convenience functions
export const loadInventory = ApiInventoryManager.loadInventory;
export const analyzeInventory = ApiInventoryManager.analyzeInventory;
export const getInventoryStats = ApiInventoryManager.getStats;

/**
 * Progressive Disclosure System
 * Provides adaptive content delivery based on user experience and context complexity
 */

import { EnhancedQueryContext } from "../analysis/query-analyzer.js";
import {
  ResponseSection,
  CodeExample,
  FollowUpAction,
} from "./template-engine.js";

export interface DisclosureLevel {
  name: "basic" | "intermediate" | "advanced" | "expert";
  displayName: string;
  description: string;
  targetAudience: string[];
  contentComplexity: number; // 1-4 scale
  includeExamples: boolean;
  includeBestPractices: boolean;
  includePerformanceNotes: boolean;
  includeTroubleshooting: boolean;
}

export interface ProgressiveContent {
  level: DisclosureLevel;
  sections: ResponseSection[];
  examples: CodeExample[];
  followUps: FollowUpAction[];
  nextLevelHint?: string;
  estimatedReadTime: number;
}

export interface ContentAdaptationRules {
  experienceLevel: "beginner" | "intermediate" | "expert";
  queryComplexity: "simple" | "intermediate" | "advanced";
  timeConstraint?: "quick" | "detailed" | "comprehensive";
  preferredFormat?: "minimal" | "detailed" | "tutorial";
}

export class ProgressiveDisclosure {
  private static disclosureLevels: Map<string, DisclosureLevel> = new Map();
  private static contentFilters: Map<string, ContentFilter> = new Map();

  static {
    this.initializeDisclosureLevels();
    this.initializeContentFilters();
  }

  /**
   * Initialize disclosure levels
   */
  private static initializeDisclosureLevels(): void {
    this.disclosureLevels.set("basic", {
      name: "basic",
      displayName: "Basic",
      description: "Essential information with simple examples",
      targetAudience: ["beginner", "quick-reference"],
      contentComplexity: 1,
      includeExamples: true,
      includeBestPractices: false,
      includePerformanceNotes: false,
      includeTroubleshooting: false,
    });

    this.disclosureLevels.set("intermediate", {
      name: "intermediate",
      displayName: "Intermediate",
      description:
        "Detailed explanation with practical examples and best practices",
      targetAudience: ["intermediate", "practical-usage"],
      contentComplexity: 2,
      includeExamples: true,
      includeBestPractices: true,
      includePerformanceNotes: false,
      includeTroubleshooting: false,
    });

    this.disclosureLevels.set("advanced", {
      name: "advanced",
      displayName: "Advanced",
      description:
        "Comprehensive guide with performance considerations and troubleshooting",
      targetAudience: ["expert", "production-usage"],
      contentComplexity: 3,
      includeExamples: true,
      includeBestPractices: true,
      includePerformanceNotes: true,
      includeTroubleshooting: true,
    });

    this.disclosureLevels.set("expert", {
      name: "expert",
      displayName: "Expert",
      description:
        "Complete reference with internals, edge cases, and optimization strategies",
      targetAudience: ["expert", "architecture-design"],
      contentComplexity: 4,
      includeExamples: true,
      includeBestPractices: true,
      includePerformanceNotes: true,
      includeTroubleshooting: true,
    });
  }

  /**
   * Initialize content filters for different disclosure levels
   */
  private static initializeContentFilters(): void {
    // Basic level filter - only essential information
    this.contentFilters.set("basic", {
      includeSections: ["header", "text"],
      excludeSections: ["warning", "tip"],
      maxSections: 3,
      maxExamples: 1,
      exampleComplexity: ["simple"],
      includeFollowUps: true,
      maxFollowUps: 2,
    });

    // Intermediate level filter - practical information
    this.contentFilters.set("intermediate", {
      includeSections: ["header", "text", "code", "tip"],
      excludeSections: [],
      maxSections: 5,
      maxExamples: 2,
      exampleComplexity: ["simple", "intermediate"],
      includeFollowUps: true,
      maxFollowUps: 3,
    });

    // Advanced level filter - comprehensive information
    this.contentFilters.set("advanced", {
      includeSections: [
        "header",
        "text",
        "code",
        "list",
        "table",
        "warning",
        "tip",
      ],
      excludeSections: [],
      maxSections: 7,
      maxExamples: 3,
      exampleComplexity: ["simple", "intermediate", "advanced"],
      includeFollowUps: true,
      maxFollowUps: 4,
    });

    // Expert level filter - everything
    this.contentFilters.set("expert", {
      includeSections: [
        "header",
        "text",
        "code",
        "list",
        "table",
        "warning",
        "tip",
      ],
      excludeSections: [],
      maxSections: 10,
      maxExamples: 5,
      exampleComplexity: ["simple", "intermediate", "advanced"],
      includeFollowUps: true,
      maxFollowUps: 6,
    });
  }

  /**
   * Generate progressive content based on context and adaptation rules
   */
  static generateProgressiveContent(
    context: EnhancedQueryContext,
    baseSections: ResponseSection[],
    baseExamples: CodeExample[],
    baseFollowUps: FollowUpAction[],
  ): ProgressiveContent {
    const adaptationRules = this.deriveAdaptationRules(context);
    const disclosureLevel = this.selectDisclosureLevel(
      adaptationRules,
      context,
    );
    const contentFilter = this.contentFilters.get(disclosureLevel.name)!;

    return {
      level: disclosureLevel,
      sections: this.filterSections(baseSections, contentFilter, context),
      examples: this.filterExamples(baseExamples, contentFilter, context),
      followUps: this.filterFollowUps(baseFollowUps, contentFilter, context),
      nextLevelHint: this.generateNextLevelHint(disclosureLevel, context),
      estimatedReadTime: this.calculateReadTime(disclosureLevel, contentFilter),
    };
  }

  /**
   * Derive adaptation rules from context
   */
  private static deriveAdaptationRules(
    context: EnhancedQueryContext,
  ): ContentAdaptationRules {
    return {
      experienceLevel: context.userExperienceLevel,
      queryComplexity: context.complexity,
      timeConstraint: this.inferTimeConstraint(context),
      preferredFormat: context.preferredFormat,
    };
  }

  /**
   * Select appropriate disclosure level
   */
  private static selectDisclosureLevel(
    rules: ContentAdaptationRules,
    context: EnhancedQueryContext,
  ): DisclosureLevel {
    // Start with user experience level
    let levelName =
      rules.experienceLevel === "beginner"
        ? "basic"
        : rules.experienceLevel === "intermediate"
          ? "intermediate"
          : "advanced";

    // Adjust based on query complexity
    if (rules.queryComplexity === "advanced" && levelName === "basic") {
      levelName = "intermediate";
    } else if (rules.queryComplexity === "simple" && levelName === "advanced") {
      levelName = "intermediate";
    }

    // Adjust based on time constraint
    if (rules.timeConstraint === "quick" && levelName !== "basic") {
      levelName = "basic";
    } else if (rules.timeConstraint === "comprehensive") {
      levelName = "expert";
    }

    // Adjust based on preferred format
    if (rules.preferredFormat === "minimal") {
      levelName = "basic";
    } else if (rules.preferredFormat === "tutorial") {
      levelName = levelName === "basic" ? "intermediate" : "advanced";
    }

    // Override for troubleshooting queries
    if (context.queryType === "troubleshooting") {
      levelName = "advanced"; // Troubleshooting needs detailed information
    }

    return (
      this.disclosureLevels.get(levelName) ||
      this.disclosureLevels.get("intermediate")!
    );
  }

  /**
   * Filter sections based on disclosure level
   */
  private static filterSections(
    sections: ResponseSection[],
    filter: ContentFilter,
    context: EnhancedQueryContext,
  ): ResponseSection[] {
    return sections
      .filter((section) => {
        // Include/exclude based on section type
        if (filter.excludeSections.includes(section.type)) return false;
        if (
          filter.includeSections.length > 0 &&
          !filter.includeSections.includes(section.type)
        )
          return false;

        // Apply conditional filters
        if (section.conditional && !section.conditional(context)) return false;

        return true;
      })
      .sort((a, b) => a.priority - b.priority)
      .slice(0, filter.maxSections)
      .map((section) => this.adaptSectionContent(section, filter, context));
  }

  /**
   * Adapt section content based on disclosure level
   */
  private static adaptSectionContent(
    section: ResponseSection,
    filter: ContentFilter,
    context: EnhancedQueryContext,
  ): ResponseSection {
    let adaptedContent = section.content;

    // Simplify technical content for basic level
    if (filter.maxSections <= 3) {
      adaptedContent = this.simplifyTechnicalContent(adaptedContent);
    }

    // Add progressive hints for intermediate level
    if (filter.maxSections > 3 && filter.maxSections <= 5) {
      adaptedContent = this.addProgressiveHints(adaptedContent, section.type);
    }

    // Add detailed explanations for advanced level
    if (filter.maxSections > 5) {
      adaptedContent = this.addDetailedExplanations(
        adaptedContent,
        section.type,
      );
    }

    return {
      ...section,
      content: adaptedContent,
    };
  }

  /**
   * Filter examples based on disclosure level
   */
  private static filterExamples(
    examples: CodeExample[],
    filter: ContentFilter,
    context: EnhancedQueryContext,
  ): CodeExample[] {
    return examples
      .filter((example) =>
        filter.exampleComplexity.includes(example.complexity),
      )
      .sort((a, b) => {
        // Sort by complexity (simple first) and relevance
        const complexityOrder = { simple: 1, intermediate: 2, advanced: 3 };
        return complexityOrder[a.complexity] - complexityOrder[b.complexity];
      })
      .slice(0, filter.maxExamples)
      .map((example) => this.adaptExampleContent(example, filter, context));
  }

  /**
   * Adapt example content based on disclosure level
   */
  private static adaptExampleContent(
    example: CodeExample,
    filter: ContentFilter,
    context: EnhancedQueryContext,
  ): CodeExample {
    let adaptedCode = example.code;
    let adaptedDescription = example.description;

    // Simplify code for basic level
    if (filter.maxExamples === 1) {
      adaptedCode = this.simplifyCode(adaptedCode);
      adaptedDescription = this.simplifyDescription(adaptedDescription);
    }

    // Add detailed comments for advanced level
    if (filter.maxExamples >= 3) {
      adaptedCode = this.addDetailedComments(adaptedCode);
      adaptedDescription = this.addImplementationNotes(adaptedDescription);
    }

    return {
      ...example,
      code: adaptedCode,
      description: adaptedDescription,
    };
  }

  /**
   * Filter follow-up actions based on disclosure level
   */
  private static filterFollowUps(
    followUps: FollowUpAction[],
    filter: ContentFilter,
    context: EnhancedQueryContext,
  ): FollowUpAction[] {
    if (!filter.includeFollowUps) return [];

    return followUps
      .sort(
        (a, b) =>
          this.calculateFollowUpRelevance(b, context) -
          this.calculateFollowUpRelevance(a, context),
      )
      .slice(0, filter.maxFollowUps)
      .map((followUp) => this.adaptFollowUpContent(followUp, filter, context));
  }

  /**
   * Calculate relevance score for follow-up actions
   */
  private static calculateFollowUpRelevance(
    followUp: FollowUpAction,
    context: EnhancedQueryContext,
  ): number {
    let score = 0;

    // Boost relevance based on intent
    const intentBoosts = {
      search: ["show-examples", "browse-category"],
      generate: ["add-tests", "add-error-handling"],
      migrate: ["generate-migration-code", "validate-migration"],
      compare: ["detailed-analysis"],
    };

    const boosts = intentBoosts[context.intent as keyof typeof intentBoosts] || [];
    if (boosts.some((boost: string) => followUp.action.includes(boost))) {
      score += 0.5;
    }

    // Boost based on user experience level
    if (
      context.userExperienceLevel === "beginner" &&
      followUp.action.includes("examples")
    ) {
      score += 0.3;
    } else if (
      context.userExperienceLevel === "expert" &&
      followUp.action.includes("optimize")
    ) {
      score += 0.3;
    }

    return score;
  }

  /**
   * Adapt follow-up content based on disclosure level
   */
  private static adaptFollowUpContent(
    followUp: FollowUpAction,
    filter: ContentFilter,
    context: EnhancedQueryContext,
  ): FollowUpAction {
    let adaptedDescription = followUp.description;

    // Simplify descriptions for basic level
    if (filter.maxFollowUps <= 2) {
      adaptedDescription = this.simplifyDescription(adaptedDescription);
    }

    // Add context for advanced level
    if (filter.maxFollowUps >= 4) {
      adaptedDescription = this.addContextualDescription(
        adaptedDescription,
        followUp.action,
      );
    }

    return {
      ...followUp,
      description: adaptedDescription,
    };
  }

  /**
   * Generate hint for next disclosure level
   */
  private static generateNextLevelHint(
    currentLevel: DisclosureLevel,
    context: EnhancedQueryContext,
  ): string | undefined {
    const nextLevelMap = {
      basic: "intermediate",
      intermediate: "advanced",
      advanced: "expert",
      expert: undefined,
    };

    const nextLevelName = nextLevelMap[currentLevel.name];
    if (!nextLevelName) return undefined;

    const nextLevel = this.disclosureLevels.get(nextLevelName);
    if (!nextLevel) return undefined;

    const nextLevelHints: Record<string, string> = {
      intermediate: "Want more details? Ask for examples and best practices.",
      advanced:
        "Need production guidance? Ask for performance notes and troubleshooting.",
      expert:
        "Looking for complete reference? Ask for internals and optimization strategies.",
    };
    return nextLevelHints[nextLevelName] || "";
  }

  /**
   * Calculate estimated read time
   */
  private static calculateReadTime(
    level: DisclosureLevel,
    filter: ContentFilter,
  ): number {
    const baseTime = level.contentComplexity; // 1-4 minutes base
    const sectionTime = Math.ceil(filter.maxSections / 3); // Additional time for sections
    const exampleTime = filter.maxExamples; // 1 minute per example

    return baseTime + sectionTime + exampleTime;
  }

  /**
   * Infer time constraint from context
   */
  private static inferTimeConstraint(
    context: EnhancedQueryContext,
  ): "quick" | "detailed" | "comprehensive" {
    // Check for time-related keywords in the original query
    if (context.preferredFormat === "minimal") return "quick";
    if (context.preferredFormat === "tutorial") return "comprehensive";

    // Infer from query type
    if (context.queryType === "direct-command") return "quick";
    if (context.queryType === "workflow") return "comprehensive";

    return "detailed"; // Default
  }

  /**
   * Content adaptation helper methods
   */
  private static simplifyTechnicalContent(content: string): string {
    return content
      .replace(/\*\*Advanced:\*\*[^*]*\*\*/g, "") // Remove advanced notes
      .replace(/\*\*Performance:\*\*[^*]*\*\*/g, "") // Remove performance notes
      .replace(/\b(optimization|internals|edge cases)\b/gi, "") // Remove complex terms
      .trim();
  }

  private static addProgressiveHints(
    content: string,
    sectionType: string,
  ): string {
    const progressiveHints: Record<string, string> = {
      text: "\n\n💡 *Need more details? Ask for advanced examples.*",
      code: "\n\n🔍 *Want to see error handling? Ask for production-ready code.*",
      tip: "\n\n⚡ *Looking for performance tips? Ask for optimization guidance.*",
    };
    return content + (progressiveHints[sectionType] || "");
  }

  private static addDetailedExplanations(
    content: string,
    sectionType: string,
  ): string {
    if (sectionType === "text" && !content.includes("**Why:**")) {
      return (
        content +
        "\n\n**Why:** This approach ensures optimal performance and maintainability."
      );
    }
    return content;
  }

  private static simplifyCode(code: string): string {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
      .replace(/\/\/.*$/gm, "") // Remove single-line comments
      .replace(/\n\s*\n/g, "\n") // Remove empty lines
      .trim();
  }

  private static addDetailedComments(code: string): string {
    const lines = code.split("\n");
    const commentedLines = lines.map((line) => {
      if (line.includes("await client.")) {
        return line + " // Redis operation - handle errors appropriately";
      }
      if (line.includes("createClient")) {
        return line + " // Configure connection options for production";
      }
      return line;
    });
    return commentedLines.join("\n");
  }

  private static simplifyDescription(description: string): string {
    return description
      .replace(/\b(comprehensive|sophisticated|advanced)\b/gi, "") // Remove complex adjectives
      .replace(/\([^)]*\)/g, "") // Remove parenthetical notes
      .trim();
  }

  private static addImplementationNotes(description: string): string {
    return (
      description +
      " Consider error handling, connection pooling, and monitoring in production environments."
    );
  }

  private static addContextualDescription(
    description: string,
    action: string,
  ): string {
    const contextMap = {
      "add-tests": " - Essential for production deployments",
      optimize: " - Critical for high-traffic applications",
      validate: " - Prevents runtime errors and data corruption",
    };

    const contextKey = Object.keys(contextMap).find((key) =>
      action.includes(key),
    );
    return description + (contextMap?.[contextKey as keyof typeof contextMap] || "");
  }

  /**
   * Public API methods
   */

  /**
   * Get available disclosure levels
   */
  static getDisclosureLevels(): DisclosureLevel[] {
    return Array.from(this.disclosureLevels.values());
  }

  /**
   * Get specific disclosure level
   */
  static getDisclosureLevel(levelName: string): DisclosureLevel | undefined {
    return this.disclosureLevels.get(levelName);
  }

  /**
   * Preview content at different disclosure levels
   */
  static previewLevels(
    context: EnhancedQueryContext,
    baseSections: ResponseSection[],
    baseExamples: CodeExample[],
    baseFollowUps: FollowUpAction[],
  ): Map<string, ProgressiveContent> {
    const previews = new Map<string, ProgressiveContent>();

    for (const [levelName, level] of this.disclosureLevels) {
      const filter = this.contentFilters.get(levelName)!;
      previews.set(levelName, {
        level,
        sections: this.filterSections(baseSections, filter, context),
        examples: this.filterExamples(baseExamples, filter, context),
        followUps: this.filterFollowUps(baseFollowUps, filter, context),
        nextLevelHint: this.generateNextLevelHint(level, context),
        estimatedReadTime: this.calculateReadTime(level, filter),
      });
    }

    return previews;
  }
}

interface ContentFilter {
  includeSections: string[];
  excludeSections: string[];
  maxSections: number;
  maxExamples: number;
  exampleComplexity: string[];
  includeFollowUps: boolean;
  maxFollowUps: number;
}

// Export convenience functions
export const generateProgressiveContent =
  ProgressiveDisclosure.generateProgressiveContent;
export const getDisclosureLevels = ProgressiveDisclosure.getDisclosureLevels;
export const previewLevels = ProgressiveDisclosure.previewLevels;

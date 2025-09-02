/**
 * Smart Suggestions Engine
 * Integrates ranking engine and command discovery for intelligent recommendations
 */

import SmartSuggestionRanker, {
  type SmartSuggestion,
  type SuggestionRequest,
  type SuggestionResult,
  type UserPreferenceProfile,
  type RankingStrategy,
} from "./ranking-engine.js";

import CommandDiscoveryEngine, {
  type DiscoveredCommand,
  type WorkflowRecommendation,
  type CommandDiscoveryRequest,
  type DiscoveryResult,
} from "./command-discovery.js";

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { UserLearningProfile } from "../conversational/followup-generator.js";
import { SessionMemory } from "../persistence/session-memory.js";
import { LearningSnapshot } from "../persistence/learning-experience.js";

export interface SmartSuggestionsRequest {
  sessionId: string;
  context: EnhancedQueryContext;
  userProfile: UserLearningProfile;
  requestType:
    | "proactive"
    | "reactive"
    | "discovery"
    | "workflow"
    | "comprehensive";
  baseCommand?: string;
  sessionMemory?: SessionMemory;
  learningSnapshot?: LearningSnapshot;
  preferences: SuggestionPreferences;
}

export interface SuggestionPreferences {
  maxSuggestions: number;
  includeWorkflows: boolean;
  includeDiscovery: boolean;
  focusAreas: string[];
  complexityRange: { min: string; max: string };
  timeConstraint?: string;
  learningGoals?: string[];
}

export interface ComprehensiveSuggestionResult {
  sessionId: string;
  smartSuggestions: SmartSuggestion[];
  discoveredCommands: DiscoveredCommand[];
  workflowRecommendations: WorkflowRecommendation[];
  proactiveRecommendations: ProactiveRecommendation[];
  learningPathSuggestions: LearningPathSuggestion[];
  optimizationOpportunities: OptimizationOpportunity[];
  totalSuggestions: number;
  confidence: number;
  nextActions: string[];
}

export interface ProactiveRecommendation {
  id: string;
  type:
    | "skill_building"
    | "pattern_exploration"
    | "optimization"
    | "troubleshooting";
  title: string;
  description: string;
  reasoning: string;
  suggestedActions: SuggestedAction[];
  priority: "low" | "medium" | "high" | "critical";
  estimatedImpact: string;
  timeToImplement: string;
}

export interface SuggestedAction {
  actionType:
    | "learn_command"
    | "practice_pattern"
    | "implement_workflow"
    | "optimize_code";
  description: string;
  resources: ActionResource[];
  successCriteria: string[];
}

export interface ActionResource {
  type: "documentation" | "example" | "tutorial" | "exercise";
  title: string;
  content?: string;
  url?: string;
}

export interface LearningPathSuggestion {
  pathId: string;
  name: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  nextStepTitle: string;
  nextStepCommands: string[];
  estimatedTimeToComplete: string;
  difficultyProgression: string[];
}

export interface OptimizationOpportunity {
  opportunityId: string;
  category:
    | "performance"
    | "memory"
    | "network"
    | "code_quality"
    | "best_practices";
  title: string;
  description: string;
  currentApproach: string;
  suggestedApproach: string;
  expectedImprovement: string;
  implementationSteps: string[];
  relatedCommands: string[];
}

export interface SuggestionAnalytics {
  totalSuggestionsGenerated: number;
  acceptanceRate: number;
  topSuggestionTypes: string[];
  userEngagementMetrics: EngagementMetric[];
  effectivenessScores: Record<string, number>;
  improvementRecommendations: string[];
}

export interface EngagementMetric {
  metric: string;
  value: number;
  trend: "increasing" | "stable" | "decreasing";
  timeframe: string;
}

export class SmartSuggestionsEngine {
  private ranker: SmartSuggestionRanker;
  private discoveryEngine: CommandDiscoveryEngine;
  private analytics: Map<string, SuggestionAnalytics> = new Map();
  private proactiveEngine: ProactiveSuggestionEngine;

  constructor() {
    this.ranker = new SmartSuggestionRanker();
    this.discoveryEngine = new CommandDiscoveryEngine();
    this.proactiveEngine = new ProactiveSuggestionEngine();
  }

  /**
   * Generate comprehensive smart suggestions
   */
  async generateComprehensiveSuggestions(
    request: SmartSuggestionsRequest,
  ): Promise<ComprehensiveSuggestionResult> {
    const results: Partial<ComprehensiveSuggestionResult> = {
      sessionId: request.sessionId,
      smartSuggestions: [],
      discoveredCommands: [],
      workflowRecommendations: [],
      proactiveRecommendations: [],
      learningPathSuggestions: [],
      optimizationOpportunities: [],
    };

    // Generate smart suggestions based on ranking
    if (
      request.requestType === "comprehensive" ||
      request.requestType === "reactive"
    ) {
      const suggestionRequest: SuggestionRequest = {
        context: request.context,
        userProfile: request.userProfile,
        sessionMemory: request.sessionMemory,
        learningSnapshot: request.learningSnapshot,
        requestType:
          request.requestType === "reactive" ? "reactive" : "contextual",
        maxSuggestions: request.preferences.maxSuggestions,
        filters: {
          complexityRange: request.preferences.complexityRange,
          focusAreas: request.preferences.focusAreas,
          timeConstraints: request.preferences.timeConstraint,
        },
      };

      const suggestionResult =
        await this.ranker.generateSmartSuggestions(suggestionRequest);
      results.smartSuggestions = suggestionResult.suggestions;
    }

    // Generate command discovery suggestions
    if (
      request.baseCommand &&
      (request.requestType === "discovery" ||
        request.requestType === "comprehensive")
    ) {
      const discoveryRequest: CommandDiscoveryRequest = {
        baseCommand: request.baseCommand,
        context: request.context,
        userProfile: request.userProfile,
        discoveryType: "comprehensive",
        maxResults: Math.floor(request.preferences.maxSuggestions / 2),
        includeWorkflows: request.preferences.includeWorkflows,
      };

      const discoveryResult =
        await this.discoveryEngine.discoverRelatedCommands(discoveryRequest);
      results.discoveredCommands = discoveryResult.discoveredCommands;
      results.workflowRecommendations = discoveryResult.workflowRecommendations;
    }

    // Generate proactive recommendations
    if (
      request.requestType === "proactive" ||
      request.requestType === "comprehensive"
    ) {
      results.proactiveRecommendations =
        await this.proactiveEngine.generateProactiveRecommendations(
          request.context,
          request.userProfile,
          request.sessionMemory,
          request.learningSnapshot,
        );
    }

    // Generate learning path suggestions
    if (request.preferences.learningGoals?.length) {
      results.learningPathSuggestions = this.generateLearningPathSuggestions(
        request.userProfile,
        request.preferences.learningGoals,
        request.context,
      );
    }

    // Generate optimization opportunities
    if (request.sessionMemory || request.learningSnapshot) {
      results.optimizationOpportunities =
        this.generateOptimizationOpportunities(
          request.context,
          request.sessionMemory,
          request.learningSnapshot,
        );
    }

    // Calculate overall metrics
    const totalSuggestions =
      (results.smartSuggestions?.length || 0) +
      (results.discoveredCommands?.length || 0) +
      (results.proactiveRecommendations?.length || 0);

    const confidence = this.calculateOverallConfidence(results);
    const nextActions = this.generateNextActions(results, request);

    return {
      ...results,
      totalSuggestions,
      confidence,
      nextActions,
    } as ComprehensiveSuggestionResult;
  }

  /**
   * Generate contextual suggestions based on current session state
   */
  async generateContextualSuggestions(
    context: EnhancedQueryContext,
    sessionMemory: SessionMemory,
    learningSnapshot: LearningSnapshot,
    maxSuggestions: number = 8,
  ): Promise<SmartSuggestion[]> {
    return await this.ranker.generateContextualSuggestions(
      context,
      sessionMemory,
      learningSnapshot,
    );
  }

  /**
   * Update suggestion effectiveness based on user interactions
   */
  updateSuggestionEffectiveness(
    sessionId: string,
    suggestionId: string,
    interaction: SuggestionInteraction,
  ): void {
    // Update analytics and learning models
    this.updateAnalytics(sessionId, suggestionId, interaction);

    // Update user preferences in ranker
    this.ranker.updateUserPreferences(sessionId, [interaction]);
  }

  /**
   * Get suggestion analytics for a session
   */
  getSuggestionAnalytics(sessionId: string): SuggestionAnalytics | undefined {
    return this.analytics.get(sessionId);
  }

  /**
   * Private helper methods
   */
  private generateLearningPathSuggestions(
    userProfile: UserLearningProfile,
    learningGoals: string[],
    context: EnhancedQueryContext,
  ): LearningPathSuggestion[] {
    return learningGoals.map((goal, index) => ({
      pathId: `path-${index}`,
      name: `Path to ${goal}`,
      description: `Structured learning path for ${goal}`,
      currentStep: 1,
      totalSteps: 5,
      nextStepTitle: `Begin with fundamentals of ${goal}`,
      nextStepCommands: this.getCommandsForGoal(goal),
      estimatedTimeToComplete: this.estimateTimeForGoal(
        goal,
        userProfile.experienceLevel,
      ),
      difficultyProgression: ["beginner", "intermediate", "advanced"],
    }));
  }

  private generateOptimizationOpportunities(
    context: EnhancedQueryContext,
    sessionMemory?: SessionMemory,
    learningSnapshot?: LearningSnapshot,
  ): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = [];

    // Analyze for performance optimization opportunities
    if (
      context.intent === "help" ||
      context.intent === "help" // secondary not available
    ) {
      opportunities.push({
        opportunityId: "perf-optimization-1",
        category: "performance",
        title: "Use Pipelining for Batch Operations",
        description: "Reduce network round trips by batching commands",
        currentApproach: "Individual command execution",
        suggestedApproach: "Pipeline multiple commands together",
        expectedImprovement: "50-80% reduction in network latency",
        implementationSteps: [
          "Identify commands that can be batched",
          "Use client.pipeline() to group commands",
          "Execute pipeline with .exec()",
          "Handle results array appropriately",
        ],
        relatedCommands: ["PIPELINE", "MULTI", "EXEC"],
      });
    }

    // Analyze memory optimization opportunities
    if (
      sessionMemory &&
      this.detectMemoryOptimizationOpportunity(sessionMemory)
    ) {
      opportunities.push({
        opportunityId: "memory-optimization-1",
        category: "memory",
        title: "Optimize Memory Usage with Expiration",
        description: "Set appropriate TTL values to prevent memory bloat",
        currentApproach: "Keys without expiration",
        suggestedApproach: "Set TTL based on data lifecycle",
        expectedImprovement: "30-50% reduction in memory usage",
        implementationSteps: [
          "Analyze data access patterns",
          "Set appropriate TTL values",
          "Use EXPIRE or SET with EX parameter",
          "Monitor memory usage improvements",
        ],
        relatedCommands: ["EXPIRE", "TTL", "SET"],
      });
    }

    return opportunities;
  }

  private calculateOverallConfidence(
    results: Partial<ComprehensiveSuggestionResult>,
  ): number {
    let totalConfidence = 0;
    let count = 0;

    if (results.smartSuggestions?.length) {
      const avgConfidence =
        results.smartSuggestions.reduce(
          (sum, s) => sum + s.ranking.confidenceLevel,
          0,
        ) / results.smartSuggestions.length;
      totalConfidence += avgConfidence;
      count++;
    }

    if (results.discoveredCommands?.length) {
      const avgRelevance =
        results.discoveredCommands.reduce(
          (sum, c) => sum + c.relevanceScore,
          0,
        ) / results.discoveredCommands.length;
      totalConfidence += avgRelevance;
      count++;
    }

    return count > 0 ? totalConfidence / count : 0.5;
  }

  private generateNextActions(
    results: Partial<ComprehensiveSuggestionResult>,
    request: SmartSuggestionsRequest,
  ): string[] {
    const actions: string[] = [];

    if (results.smartSuggestions?.length) {
      actions.push("Explore top-ranked suggestions");
    }

    if (results.discoveredCommands?.length) {
      actions.push("Learn about discovered related commands");
    }

    if (results.workflowRecommendations?.length) {
      actions.push("Practice recommended workflow patterns");
    }

    if (results.proactiveRecommendations?.length) {
      actions.push("Consider proactive improvement opportunities");
    }

    if (results.optimizationOpportunities?.length) {
      actions.push("Implement suggested optimizations");
    }

    return actions.slice(0, 5); // Limit to top 5 actions
  }

  private getCommandsForGoal(goal: string): string[] {
    const goalCommands: Record<string, string[]> = {
      caching: ["GET", "SET", "EXPIRE", "TTL"],
      sessions: ["HSET", "HGET", "EXPIRE", "DEL"],
      analytics: ["INCR", "HINCRBY", "ZADD", "ZRANGE"],
      messaging: ["XADD", "XREAD", "PUBLISH", "SUBSCRIBE"],
    };

    return goalCommands[goal.toLowerCase()] || ["GET", "SET"];
  }

  private estimateTimeForGoal(goal: string, experienceLevel: string): string {
    const baseTime = {
      caching: 2,
      sessions: 3,
      analytics: 4,
      messaging: 5,
    };

    const multiplier = {
      beginner: 1.5,
      intermediate: 1.0,
      advanced: 0.7,
      expert: 0.5,
    };

    const hours =
      (baseTime[goal.toLowerCase() as keyof typeof baseTime] || 3) *
      (multiplier[experienceLevel as keyof typeof multiplier] || 1.0);

    return `${Math.ceil(hours)} hours`;
  }

  private detectMemoryOptimizationOpportunity(
    sessionMemory: SessionMemory,
  ): boolean {
    // Simplified detection logic
    return sessionMemory.memoryLayers.shortTerm.memories.length > 15;
  }

  private updateAnalytics(
    sessionId: string,
    suggestionId: string,
    interaction: SuggestionInteraction,
  ): void {
    let analytics = this.analytics.get(sessionId);

    if (!analytics) {
      analytics = {
        totalSuggestionsGenerated: 0,
        acceptanceRate: 0,
        topSuggestionTypes: [],
        userEngagementMetrics: [],
        effectivenessScores: {},
        improvementRecommendations: [],
      };
    }

    // Update metrics based on interaction
    analytics.totalSuggestionsGenerated++;

    if (interaction.interactionType === "accepted") {
      analytics.acceptanceRate = analytics.acceptanceRate * 0.9 + 0.1; // Moving average
    }

    this.analytics.set(sessionId, analytics);
  }
}

/**
 * Proactive Suggestion Engine for generating proactive recommendations
 */
class ProactiveSuggestionEngine {
  async generateProactiveRecommendations(
    context: EnhancedQueryContext,
    userProfile: UserLearningProfile,
    sessionMemory?: SessionMemory,
    learningSnapshot?: LearningSnapshot,
  ): Promise<ProactiveRecommendation[]> {
    const recommendations: ProactiveRecommendation[] = [];

    // Skill building recommendations
    if (userProfile.experienceLevel === "beginner") {
      recommendations.push({
        id: "skill-building-1",
        type: "skill_building",
        title: "Master Hash Operations",
        description:
          "Build foundational skills with Redis hash data structures",
        reasoning: "Hash operations are essential for structured data storage",
        suggestedActions: [
          {
            actionType: "practice_pattern",
            description: "Practice HSET, HGET, and HGETALL operations",
            resources: [
              {
                type: "tutorial",
                title: "Redis Hash Tutorial",
                content: "Step-by-step guide to hash operations",
              },
            ],
            successCriteria: [
              "Complete hash exercises",
              "Understand when to use hashes",
            ],
          },
        ],
        priority: "medium",
        estimatedImpact: "Improved data modeling capabilities",
        timeToImplement: "45 minutes",
      });
    }

    return recommendations;
  }
}

// Supporting interfaces
interface SuggestionInteraction {
  suggestionId: string;
  interactionType: "accepted" | "rejected" | "modified" | "ignored";
  timestamp: Date;
  feedback?: string;
  timeSpent?: number;
  outcome?: string;
}

// Export all components
export {
  SmartSuggestionRanker,
  CommandDiscoveryEngine,
  type SmartSuggestion,
  type DiscoveredCommand,
  type WorkflowRecommendation,
// Export statement removed to prevent conflicts - already exported inline
};

export default SmartSuggestionsEngine;

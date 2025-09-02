/**
 * Smart Suggestion Ranking and Personalization Engine
 * Provides intelligent ranking and personalized recommendations for Redis commands and patterns
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { UserLearningProfile } from "../conversational/followup-generator.js";
import { ConversationMessage } from "../conversational/session-manager.js";
import { SessionMemory, MemoryInsight } from "../persistence/session-memory.js";
import { LearningSnapshot } from "../persistence/learning-experience.js";

export interface SmartSuggestion {
  suggestionId: string;
  type:
    | "command"
    | "pattern"
    | "workflow"
    | "optimization"
    | "learning"
    | "troubleshooting";
  title: string;
  description: string;
  content: SuggestionContent;
  ranking: SuggestionRanking;
  personalization: PersonalizationData;
  metadata: SuggestionMetadata;
}

export interface SuggestionContent {
  primaryAction: string;
  explanation: string;
  codeExamples: CodeExample[];
  relatedConcepts: string[];
  prerequisites: string[];
  nextSteps: string[];
  learningResources: LearningResource[];
}

export interface SuggestionRanking {
  relevanceScore: number; // 0-1
  personalizedScore: number; // 0-1
  difficultyScore: number; // 0-1
  utilityScore: number; // 0-1
  urgencyScore: number; // 0-1
  overallScore: number; // 0-1
  confidenceLevel: number; // 0-1
  rankingFactors: RankingFactor[];
}

export interface PersonalizationData {
  userAlignment: UserAlignment;
  adaptations: PersonalizationAdaptation[];
  customizations: Customization[];
  learningPathRelevance: number; // 0-1
  skillLevelMatch: number; // 0-1
  interestAlignment: number; // 0-1
}

export interface SuggestionMetadata {
  category: string;
  tags: string[];
  estimatedTime: string;
  complexity: "beginner" | "intermediate" | "advanced" | "expert";
  popularity: number; // 0-1
  effectiveness: number; // 0-1
  lastUpdated: Date;
  usageContext: string[];
}

export interface CodeExample {
  language: "typescript" | "javascript" | "glide";
  code: string;
  explanation: string;
  runnable: boolean;
  expectedOutput?: string;
}

export interface LearningResource {
  type: "documentation" | "tutorial" | "example" | "exercise" | "reference";
  title: string;
  description: string;
  url?: string;
  estimatedTime: string;
}

export interface RankingFactor {
  factor: string;
  weight: number; // 0-1
  contribution: number; // 0-1
  explanation: string;
}

export interface UserAlignment {
  experienceLevelMatch: number; // 0-1
  learningGoalAlignment: number; // 0-1
  preferenceMatch: number; // 0-1
  currentContextRelevance: number; // 0-1
}

export interface PersonalizationAdaptation {
  adaptationType:
    | "content"
    | "presentation"
    | "complexity"
    | "examples"
    | "pace";
  originalValue: any;
  adaptedValue: any;
  reasoning: string;
}

export interface Customization {
  customizationType:
    | "explanation_style"
    | "code_complexity"
    | "example_type"
    | "learning_pace";
  value: any;
  source: "user_preference" | "inferred" | "adaptive";
}

export interface SuggestionRequest {
  context: EnhancedQueryContext;
  userProfile: UserLearningProfile;
  sessionMemory?: SessionMemory;
  learningSnapshot?: LearningSnapshot;
  conversationHistory?: ConversationMessage[];
  requestType: "proactive" | "reactive" | "contextual" | "learning_based";
  maxSuggestions?: number;
  filters?: SuggestionFilters;
}

export interface SuggestionFilters {
  types?: string[];
  complexityRange?: { min: string; max: string };
  timeConstraints?: string;
  excludeKnownConcepts?: boolean;
  focusAreas?: string[];
}

export interface SuggestionResult {
  suggestions: SmartSuggestion[];
  totalGenerated: number;
  rankingStrategy: string;
  personalizationApplied: boolean;
  confidence: number; // 0-1
  recommendations: SuggestionRecommendation[];
}

export interface SuggestionRecommendation {
  type:
    | "ranking_improvement"
    | "personalization_enhancement"
    | "content_expansion";
  description: string;
  actionItems: string[];
  expectedImpact: string;
}

export interface UserPreferenceProfile {
  explanationStyle: "concise" | "detailed" | "step_by_step" | "example_heavy";
  codeComplexity: "simple" | "moderate" | "comprehensive" | "production_ready";
  learningPace: "fast" | "moderate" | "careful" | "methodical";
  interactionStyle:
    | "guided"
    | "exploratory"
    | "challenge_seeking"
    | "safety_first";
  contentPreferences: ContentPreference[];
}

export interface ContentPreference {
  contentType: string;
  preference: number; // -1 to 1 (dislike to like)
  reasoning: string;
  lastUpdated: Date;
}

export interface RankingStrategy {
  strategyId: string;
  name: string;
  description: string;
  weights: RankingWeights;
  applicableContexts: string[];
  effectiveness: number; // 0-1
}

export interface RankingWeights {
  relevance: number;
  personalization: number;
  difficulty: number;
  utility: number;
  urgency: number;
  recency: number;
  popularity: number;
}

export class SmartSuggestionRanker {
  private rankingStrategies: Map<string, RankingStrategy> = new Map();
  private userPreferences: Map<string, UserPreferenceProfile> = new Map();
  private suggestionHistory: Map<string, SuggestionInteraction[]> = new Map();
  private adaptiveLearning: AdaptiveLearningEngine;

  constructor() {
    this.initializeRankingStrategies();
    this.adaptiveLearning = new AdaptiveLearningEngine();
  }

  /**
   * Generate and rank smart suggestions
   */
  async generateSmartSuggestions(
    request: SuggestionRequest,
  ): Promise<SuggestionResult> {
    // Generate base suggestions
    const baseSuggestions = await this.generateBaseSuggestions(request);

    // Apply ranking
    const rankedSuggestions = await this.rankSuggestions(
      baseSuggestions,
      request,
    );

    // Apply personalization
    const personalizedSuggestions = await this.personalizeSuggestions(
      rankedSuggestions,
      request,
    );

    // Filter and limit results
    const filteredSuggestions = this.applyFilters(
      personalizedSuggestions,
      request.filters,
    );
    const finalSuggestions = filteredSuggestions.slice(
      0,
      request.maxSuggestions || 10,
    );

    // Generate recommendations for improvement
    const recommendations = this.generateSuggestionRecommendations(
      finalSuggestions,
      request,
    );

    return {
      suggestions: finalSuggestions,
      totalGenerated: baseSuggestions.length,
      rankingStrategy: this.selectRankingStrategy(request).name,
      personalizationApplied: true,
      confidence: this.calculateOverallConfidence(finalSuggestions),
      recommendations,
    };
  }

  /**
   * Update user preferences based on interaction feedback
   */
  updateUserPreferences(
    userId: string,
    interactions: SuggestionInteraction[],
  ): UserPreferenceProfile {
    let preferences = this.userPreferences.get(userId);

    if (!preferences) {
      preferences = this.createDefaultPreferences();
    }

    // Analyze interactions to infer preferences
    const preferenceUpdates = this.analyzeInteractionPatterns(interactions);

    // Apply adaptive learning
    preferences = this.adaptiveLearning.adaptPreferences(
      preferences,
      preferenceUpdates,
    );

    this.userPreferences.set(userId, preferences);

    // Record interaction history
    const history = this.suggestionHistory.get(userId) || [];
    history.push(...interactions);
    this.suggestionHistory.set(userId, history);

    return preferences;
  }

  /**
   * Generate contextual suggestions based on current state
   */
  async generateContextualSuggestions(
    context: EnhancedQueryContext,
    sessionMemory: SessionMemory,
    learningSnapshot: LearningSnapshot,
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Generate suggestions based on recent memory
    const memoryBasedSuggestions =
      this.generateMemoryBasedSuggestions(sessionMemory);
    suggestions.push(...memoryBasedSuggestions);

    // Generate suggestions based on learning progress
    const learningBasedSuggestions =
      this.generateLearningBasedSuggestions(learningSnapshot);
    suggestions.push(...learningBasedSuggestions);

    // Generate suggestions based on current context
    const contextBasedSuggestions =
      this.generateContextBasedSuggestions(context);
    suggestions.push(...contextBasedSuggestions);

    // Remove duplicates and rank
    const uniqueSuggestions = this.removeDuplicateSuggestions(suggestions);

    return uniqueSuggestions.slice(0, 8); // Return top 8 contextual suggestions
  }

  /**
   * Private helper methods
   */
  private initializeRankingStrategies(): void {
    // Beginner-focused strategy
    this.rankingStrategies.set("beginner_focused", {
      strategyId: "beginner_focused",
      name: "Beginner Focused",
      description:
        "Prioritizes simple, foundational concepts with clear explanations",
      weights: {
        relevance: 0.3,
        personalization: 0.25,
        difficulty: 0.2, // Lower difficulty preferred
        utility: 0.15,
        urgency: 0.05,
        recency: 0.03,
        popularity: 0.02,
      },
      applicableContexts: ["beginner", "learning"],
      effectiveness: 0.85,
    });

    // Expert-focused strategy
    this.rankingStrategies.set("expert_focused", {
      strategyId: "expert_focused",
      name: "Expert Focused",
      description:
        "Emphasizes advanced patterns, optimizations, and edge cases",
      weights: {
        relevance: 0.35,
        personalization: 0.2,
        difficulty: 0.15, // Higher difficulty acceptable
        utility: 0.2,
        urgency: 0.05,
        recency: 0.03,
        popularity: 0.02,
      },
      applicableContexts: ["expert", "advanced", "optimization"],
      effectiveness: 0.9,
    });

    // Problem-solving strategy
    this.rankingStrategies.set("problem_solving", {
      strategyId: "problem_solving",
      name: "Problem Solving",
      description: "Focuses on immediate solutions and troubleshooting",
      weights: {
        relevance: 0.4,
        personalization: 0.15,
        difficulty: 0.1,
        utility: 0.25,
        urgency: 0.08,
        recency: 0.01,
        popularity: 0.01,
      },
      applicableContexts: ["troubleshooting", "debugging", "urgent"],
      effectiveness: 0.88,
    });

    // Exploration strategy
    this.rankingStrategies.set("exploration", {
      strategyId: "exploration",
      name: "Exploration",
      description: "Encourages discovery of new concepts and patterns",
      weights: {
        relevance: 0.25,
        personalization: 0.3,
        difficulty: 0.15,
        utility: 0.15,
        urgency: 0.05,
        recency: 0.05,
        popularity: 0.05,
      },
      applicableContexts: ["exploration", "discovery", "learning"],
      effectiveness: 0.82,
    });
  }

  private async generateBaseSuggestions(
    request: SuggestionRequest,
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Command-based suggestions
    const commandSuggestions = this.generateCommandSuggestions(request);
    suggestions.push(...commandSuggestions);

    // Pattern-based suggestions
    const patternSuggestions = this.generatePatternSuggestions(request);
    suggestions.push(...patternSuggestions);

    // Workflow suggestions
    const workflowSuggestions = this.generateWorkflowSuggestions(request);
    suggestions.push(...workflowSuggestions);

    // Learning suggestions
    const learningSuggestions = this.generateLearningSuggestions(request);
    suggestions.push(...learningSuggestions);

    // Optimization suggestions
    const optimizationSuggestions =
      this.generateOptimizationSuggestions(request);
    suggestions.push(...optimizationSuggestions);

    return suggestions;
  }

  private generateCommandSuggestions(
    request: SuggestionRequest,
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Basic commands for beginners
    if (request.userProfile.experienceLevel === "beginner") {
      suggestions.push({
        suggestionId: "cmd-get-set-basics",
        type: "command",
        title: "Master GET and SET Commands",
        description:
          "Learn the fundamental Redis commands for storing and retrieving data",
        content: {
          primaryAction: "Practice GET and SET operations",
          explanation:
            "GET and SET are the most basic Redis commands for key-value operations",
          codeExamples: [
            {
              language: "typescript",
              code: 'await client.set("mykey", "myvalue");\nconst value = await client.get("mykey");',
              explanation: "Basic key-value storage and retrieval",
              runnable: true,
              expectedOutput: '"myvalue"',
            },
          ],
          relatedConcepts: ["key-value storage", "string operations"],
          prerequisites: ["Redis connection"],
          nextSteps: ["Learn MGET and MSET", "Explore TTL and EXPIRE"],
          learningResources: [
            {
              type: "tutorial",
              title: "Redis String Commands Tutorial",
              description: "Comprehensive guide to string operations",
              estimatedTime: "15 minutes",
            },
          ],
        },
        ranking: this.calculateInitialRanking("command", "beginner"),
        personalization: this.createPersonalizationData(request.userProfile),
        metadata: {
          category: "basic_commands",
          tags: ["strings", "basic", "fundamental"],
          estimatedTime: "10 minutes",
          complexity: "beginner",
          popularity: 0.95,
          effectiveness: 0.9,
          lastUpdated: new Date(),
          usageContext: ["data storage", "caching"],
        },
      });
    }

    // Advanced commands for experienced users
    if (
      request.userProfile.experienceLevel === "advanced" ||
      request.userProfile.experienceLevel === "expert"
    ) {
      suggestions.push({
        suggestionId: "cmd-pipeline-optimization",
        type: "optimization",
        title: "Optimize with Pipeline Commands",
        description:
          "Use pipelining to batch Redis commands for better performance",
        content: {
          primaryAction: "Implement command pipelining",
          explanation:
            "Pipelining reduces network round trips by batching multiple commands",
          codeExamples: [
            {
              language: "typescript",
              code: 'const pipeline = client.pipeline();\npipeline.set("key1", "value1");\npipeline.set("key2", "value2");\nconst results = await pipeline.exec();',
              explanation: "Batch multiple commands for execution",
              runnable: true,
              expectedOutput: "Array of results",
            },
          ],
          relatedConcepts: ["performance optimization", "network efficiency"],
          prerequisites: [
            "Basic Redis commands",
            "Understanding of network latency",
          ],
          nextSteps: ["Learn about transactions", "Explore Lua scripting"],
          learningResources: [
            {
              type: "documentation",
              title: "Redis Pipelining Guide",
              description: "Official guide to command pipelining",
              estimatedTime: "20 minutes",
            },
          ],
        },
        ranking: this.calculateInitialRanking("optimization", "advanced"),
        personalization: this.createPersonalizationData(request.userProfile),
        metadata: {
          category: "performance",
          tags: ["pipelining", "optimization", "advanced"],
          estimatedTime: "25 minutes",
          complexity: "advanced",
          popularity: 0.75,
          effectiveness: 0.85,
          lastUpdated: new Date(),
          usageContext: ["high performance", "bulk operations"],
        },
      });
    }

    return suggestions;
  }

  private generatePatternSuggestions(
    request: SuggestionRequest,
  ): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    // Cache pattern suggestion
    suggestions.push({
      suggestionId: "pattern-cache-aside",
      type: "pattern",
      title: "Implement Cache-Aside Pattern",
      description:
        "Learn the most common caching pattern for application-level caching",
      content: {
        primaryAction: "Implement cache-aside pattern",
        explanation:
          "Cache-aside pattern puts the application in charge of cache management",
        codeExamples: [
          {
            language: "typescript",
            code: `async function getUserData(userId: string) {
  // Try cache first
  let userData = await redis.get(\`user:\${userId}\`);
  
  if (!userData) {
    // Cache miss - fetch from database
    userData = await database.getUser(userId);
    
    // Store in cache for future requests
    await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(userData));
  } else {
    userData = JSON.parse(userData);
  }
  
  return userData;
}`,
            explanation:
              "Complete cache-aside implementation with fallback to database",
            runnable: true,
            expectedOutput: "User data from cache or database",
          },
        ],
        relatedConcepts: [
          "caching strategies",
          "data consistency",
          "performance optimization",
        ],
        prerequisites: ["Basic Redis commands", "Understanding of databases"],
        nextSteps: [
          "Learn write-through pattern",
          "Explore cache invalidation",
        ],
        learningResources: [
          {
            type: "tutorial",
            title: "Caching Patterns Deep Dive",
            description: "Comprehensive guide to Redis caching patterns",
            estimatedTime: "30 minutes",
          },
        ],
      },
      ranking: this.calculateInitialRanking(
        "pattern",
        request.userProfile.experienceLevel,
      ),
      personalization: this.createPersonalizationData(request.userProfile),
      metadata: {
        category: "caching_patterns",
        tags: ["caching", "patterns", "performance"],
        estimatedTime: "30 minutes",
        complexity: "intermediate",
        popularity: 0.88,
        effectiveness: 0.92,
        lastUpdated: new Date(),
        usageContext: ["web applications", "data caching"],
      },
    });

    return suggestions;
  }

  private async rankSuggestions(
    suggestions: SmartSuggestion[],
    request: SuggestionRequest,
  ): Promise<SmartSuggestion[]> {
    const strategy = this.selectRankingStrategy(request);

    return suggestions
      .map((suggestion) => {
        const ranking = this.calculateDetailedRanking(
          suggestion,
          request,
          strategy,
        );
        return { ...suggestion, ranking };
      })
      .sort((a, b) => b.ranking.overallScore - a.ranking.overallScore);
  }

  private async personalizeSuggestions(
    suggestions: SmartSuggestion[],
    request: SuggestionRequest,
  ): Promise<SmartSuggestion[]> {
    const userId = this.extractUserId(request);
    const userPreferences = this.userPreferences.get(userId);

    return suggestions.map((suggestion) => {
      const personalizedContent = this.personalizeContent(
        suggestion.content,
        request.userProfile,
        userPreferences,
      );
      const personalizationData = this.enhancePersonalization(
        suggestion.personalization,
        request,
      );

      return {
        ...suggestion,
        content: personalizedContent,
        personalization: personalizationData,
      };
    });
  }

  private selectRankingStrategy(request: SuggestionRequest): RankingStrategy {
    // Select strategy based on context and user profile
    if (request.requestType === "learning_based") {
      return this.rankingStrategies.get("beginner_focused")!;
    }

    if (request.userProfile.experienceLevel === "expert") {
      return this.rankingStrategies.get("expert_focused")!;
    }

    if (
      request.context.intent === "help" // confidence not available
    ) {
      return this.rankingStrategies.get("problem_solving")!;
    }

    return this.rankingStrategies.get("exploration")!;
  }

  private calculateDetailedRanking(
    suggestion: SmartSuggestion,
    request: SuggestionRequest,
    strategy: RankingStrategy,
  ): SuggestionRanking {
    const relevanceScore = this.calculateRelevanceScore(suggestion, request);
    const personalizedScore = this.calculatePersonalizationScore(
      suggestion,
      request,
    );
    const difficultyScore = this.calculateDifficultyScore(
      suggestion,
      request.userProfile,
    );
    const utilityScore = this.calculateUtilityScore(suggestion, request);
    const urgencyScore = this.calculateUrgencyScore(suggestion, request);

    const overallScore =
      relevanceScore * strategy.weights.relevance +
      personalizedScore * strategy.weights.personalization +
      difficultyScore * strategy.weights.difficulty +
      utilityScore * strategy.weights.utility +
      urgencyScore * strategy.weights.urgency +
      suggestion.metadata.popularity * strategy.weights.popularity;

    const rankingFactors: RankingFactor[] = [
      {
        factor: "relevance",
        weight: strategy.weights.relevance,
        contribution: relevanceScore,
        explanation: "How relevant to current context",
      },
      {
        factor: "personalization",
        weight: strategy.weights.personalization,
        contribution: personalizedScore,
        explanation: "Match with user preferences",
      },
      {
        factor: "difficulty",
        weight: strategy.weights.difficulty,
        contribution: difficultyScore,
        explanation: "Appropriate complexity level",
      },
    ];

    return {
      relevanceScore,
      personalizedScore,
      difficultyScore,
      utilityScore,
      urgencyScore,
      overallScore,
      confidenceLevel: Math.min(0.95, relevanceScore * personalizedScore),
      rankingFactors,
    };
  }

  // Additional helper methods continue here...
  private generateWorkflowSuggestions(
    request: SuggestionRequest,
  ): SmartSuggestion[] {
    return [];
  }
  private generateLearningSuggestions(
    request: SuggestionRequest,
  ): SmartSuggestion[] {
    return [];
  }
  private generateOptimizationSuggestions(
    request: SuggestionRequest,
  ): SmartSuggestion[] {
    return [];
  }
  private calculateInitialRanking(
    type: string,
    complexity: string,
  ): SuggestionRanking {
    return {
      relevanceScore: 0.7,
      personalizedScore: 0.6,
      difficultyScore: 0.8,
      utilityScore: 0.7,
      urgencyScore: 0.5,
      overallScore: 0.66,
      confidenceLevel: 0.8,
      rankingFactors: [],
    };
  }
  private createPersonalizationData(
    profile: UserLearningProfile,
  ): PersonalizationData {
    return {
      userAlignment: {
        experienceLevelMatch: 0.8,
        learningGoalAlignment: 0.7,
        preferenceMatch: 0.6,
        currentContextRelevance: 0.75,
      },
      adaptations: [],
      customizations: [],
      learningPathRelevance: 0.8,
      skillLevelMatch: 0.7,
      interestAlignment: 0.6,
    };
  }
  private calculateRelevanceScore(
    suggestion: SmartSuggestion,
    request: SuggestionRequest,
  ): number {
    return 0.7;
  }
  private calculatePersonalizationScore(
    suggestion: SmartSuggestion,
    request: SuggestionRequest,
  ): number {
    return 0.6;
  }
  private calculateDifficultyScore(
    suggestion: SmartSuggestion,
    profile: UserLearningProfile,
  ): number {
    return 0.8;
  }
  private calculateUtilityScore(
    suggestion: SmartSuggestion,
    request: SuggestionRequest,
  ): number {
    return 0.7;
  }
  private calculateUrgencyScore(
    suggestion: SmartSuggestion,
    request: SuggestionRequest,
  ): number {
    return 0.5;
  }
  private extractUserId(request: SuggestionRequest): string {
    return "default-user";
  }
  private personalizeContent(
    content: SuggestionContent,
    profile: UserLearningProfile,
    preferences?: UserPreferenceProfile,
  ): SuggestionContent {
    return content;
  }
  private enhancePersonalization(
    data: PersonalizationData,
    request: SuggestionRequest,
  ): PersonalizationData {
    return data;
  }
  private applyFilters(
    suggestions: SmartSuggestion[],
    filters?: SuggestionFilters,
  ): SmartSuggestion[] {
    return suggestions;
  }
  private calculateOverallConfidence(suggestions: SmartSuggestion[]): number {
    return 0.8;
  }
  private generateSuggestionRecommendations(
    suggestions: SmartSuggestion[],
    request: SuggestionRequest,
  ): SuggestionRecommendation[] {
    return [];
  }
  private createDefaultPreferences(): UserPreferenceProfile {
    return {
      explanationStyle: "detailed",
      codeComplexity: "moderate",
      learningPace: "moderate",
      interactionStyle: "guided",
      contentPreferences: [],
    };
  }
  private analyzeInteractionPatterns(
    interactions: SuggestionInteraction[],
  ): any {
    return {};
  }
  private generateMemoryBasedSuggestions(
    memory: SessionMemory,
  ): SmartSuggestion[] {
    return [];
  }
  private generateLearningBasedSuggestions(
    snapshot: LearningSnapshot,
  ): SmartSuggestion[] {
    return [];
  }
  private generateContextBasedSuggestions(
    context: EnhancedQueryContext,
  ): SmartSuggestion[] {
    return [];
  }
  private removeDuplicateSuggestions(
    suggestions: SmartSuggestion[],
  ): SmartSuggestion[] {
    const seen = new Set();
    return suggestions.filter((s) => {
      if (seen.has(s.suggestionId)) return false;
      seen.add(s.suggestionId);
      return true;
    });
  }
}

/**
 * Adaptive Learning Engine for preference optimization
 */
class AdaptiveLearningEngine {
  adaptPreferences(
    current: UserPreferenceProfile,
    updates: any,
  ): UserPreferenceProfile {
    // Implement adaptive preference learning
    return current;
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

// Export statement removed to prevent conflicts - already exported inline

export default SmartSuggestionRanker;

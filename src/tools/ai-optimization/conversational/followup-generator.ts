/**
 * Follow-up Question Generation and Contextual Hints System
 * Provides intelligent follow-up questions and contextual hints for enhanced AI agent interactions
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import {
  ConversationMessage,
  ConversationTurn,
  LearningPoint,
} from "./session-manager.js";

export interface FollowUpQuestion {
  id: string;
  question: string;
  category:
    | "clarification"
    | "deepening"
    | "exploration"
    | "application"
    | "troubleshooting";
  priority: "low" | "medium" | "high" | "critical";
  context: QuestionContext;
  expectedResponse: string;
  learningObjective?: string;
}

export interface QuestionContext {
  triggeredBy: string;
  relatedConcepts: string[];
  prerequisiteKnowledge: string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  timeToAsk:
    | "immediate"
    | "after_explanation"
    | "after_example"
    | "session_end";
}

export interface ContextualHint {
  id: string;
  hint: string;
  type:
    | "tip"
    | "warning"
    | "best_practice"
    | "performance"
    | "security"
    | "gotcha";
  relevance: number; // 0-1
  context: HintContext;
  actionable: boolean;
  resources?: HintResource[];
}

export interface HintContext {
  applicableWhen: string[];
  commandsRelated: string[];
  patternsRelated: string[];
  userExperience: string[];
  situationTriggers: string[];
}

export interface HintResource {
  type: "documentation" | "example" | "tutorial" | "tool";
  title: string;
  description: string;
  url?: string;
  content?: string;
}

export interface QuestionGenerationRequest {
  lastMessage: ConversationMessage;
  conversationHistory: ConversationMessage[];
  currentContext: EnhancedQueryContext;
  userLearningProfile: UserLearningProfile;
  sessionGoals: string[];
}

export interface UserLearningProfile {
  experienceLevel: string;
  preferredLearningStyle:
    | "visual"
    | "hands-on"
    | "conceptual"
    | "example-driven";
  knownConcepts: string[];
  learningGoals: string[];
  struggleAreas: string[];
  interests: string[];
}

export interface HintGenerationRequest {
  currentQuery: string;
  detectedCommands: string[];
  detectedPatterns: string[];
  userContext: EnhancedQueryContext;
  conversationState: ConversationState;
}

export interface ConversationState {
  phase:
    | "introduction"
    | "exploration"
    | "deep_dive"
    | "application"
    | "troubleshooting"
    | "wrap_up";
  momentum: "building" | "maintaining" | "declining";
  confusion_indicators: string[];
  engagement_level: "low" | "medium" | "high";
}

export interface QuestionSequence {
  sequenceId: string;
  theme: string;
  questions: FollowUpQuestion[];
  progressionLogic: ProgressionRule[];
  adaptationPoints: AdaptationPoint[];
}

export interface ProgressionRule {
  condition: string;
  nextQuestion: string;
  skipConditions: string[];
  adaptations: string[];
}

export interface AdaptationPoint {
  trigger: string;
  adaptationType: "difficulty" | "style" | "focus" | "pace";
  modification: string;
  reasoning: string;
}

export class FollowUpQuestionGenerator {
  private questionTemplates: Map<string, QuestionTemplate> = new Map();
  private hintDatabase: Map<string, ContextualHint[]> = new Map();
  private questionSequences: Map<string, QuestionSequence> = new Map();

  constructor() {
    this.initializeQuestionTemplates();
    this.initializeHintDatabase();
    this.initializeQuestionSequences();
  }

  /**
   * Generate follow-up questions based on conversation context
   */
  generateFollowUpQuestions(
    request: QuestionGenerationRequest,
  ): FollowUpQuestion[] {
    const questions: FollowUpQuestion[] = [];

    // Analyze the last message to determine question categories
    const questionCategories = this.analyzeQuestionNeeds(request);

    // Generate questions for each category
    questionCategories.forEach((category) => {
      const categoryQuestions = this.generateCategoryQuestions(
        category,
        request,
      );
      questions.push(...categoryQuestions);
    });

    // Rank and filter questions
    const rankedQuestions = this.rankQuestions(questions, request);

    // Apply learning profile filters
    const filteredQuestions = this.applyLearningProfileFilters(
      rankedQuestions,
      request.userLearningProfile,
    );

    return filteredQuestions.slice(0, 5); // Limit to top 5 questions
  }

  /**
   * Generate contextual hints for current situation
   */
  generateContextualHints(request: HintGenerationRequest): ContextualHint[] {
    const hints: ContextualHint[] = [];

    // Command-specific hints
    request.detectedCommands.forEach((command) => {
      const commandHints = this.getCommandHints(command, request);
      hints.push(...commandHints);
    });

    // Pattern-specific hints
    request.detectedPatterns.forEach((pattern) => {
      const patternHints = this.getPatternHints(pattern, request);
      hints.push(...patternHints);
    });

    // Context-sensitive hints
    const contextHints = this.getContextSensitiveHints(request);
    hints.push(...contextHints);

    // Calculate relevance and filter
    const relevantHints = hints
      .map((hint) => ({
        ...hint,
        relevance: this.calculateHintRelevance(hint, request),
      }))
      .filter((hint) => hint.relevance > 0.3)
      .sort((a, b) => b.relevance - a.relevance);

    return relevantHints.slice(0, 8); // Top 8 most relevant hints
  }

  /**
   * Generate progressive question sequence for learning path
   */
  generateQuestionSequence(
    topic: string,
    userProfile: UserLearningProfile,
    context: EnhancedQueryContext,
  ): QuestionSequence {
    const sequenceId = `seq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const baseSequence =
      this.questionSequences.get(topic) || this.createDefaultSequence(topic);

    // Adapt sequence to user profile
    const adaptedQuestions = this.adaptQuestionsToProfile(
      baseSequence.questions,
      userProfile,
    );

    // Create progression logic
    const progressionLogic = this.createProgressionLogic(
      adaptedQuestions,
      userProfile,
    );

    // Define adaptation points
    const adaptationPoints = this.defineAdaptationPoints(topic, userProfile);

    return {
      sequenceId,
      theme: topic,
      questions: adaptedQuestions,
      progressionLogic,
      adaptationPoints,
    };
  }

  /**
   * Analyze conversation to suggest next learning steps
   */
  suggestNextLearningSteps(
    conversationHistory: ConversationMessage[],
    learningProfile: UserLearningProfile,
  ): {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    practiceOpportunities: string[];
  } {
    const coveredTopics = this.extractCoveredTopics(conversationHistory);
    const skillGaps = this.identifySkillGaps(coveredTopics, learningProfile);
    const nextConcepts = this.suggestNextConcepts(
      coveredTopics,
      learningProfile,
    );

    return {
      immediate: this.generateImmediateSteps(skillGaps, learningProfile),
      shortTerm: this.generateShortTermSteps(nextConcepts, learningProfile),
      longTerm: this.generateLongTermSteps(learningProfile),
      practiceOpportunities: this.generatePracticeOpportunities(
        coveredTopics,
        learningProfile,
      ),
    };
  }

  /**
   * Initialize question templates
   */
  private initializeQuestionTemplates(): void {
    // Clarification questions
    this.questionTemplates.set("clarification", {
      patterns: [
        "Could you clarify what you mean by '{concept}'?",
        "When you say '{term}', are you referring to {options}?",
        "What specific aspect of {topic} would you like to focus on?",
        "Are you looking for {option1} or {option2}?",
        "Can you provide more context about your use case for {command}?",
      ],
      triggers: [
        "ambiguous_query",
        "multiple_interpretations",
        "unclear_intent",
      ],
      conditions: ["low_confidence", "multiple_commands_detected"],
    });

    // Deepening questions
    this.questionTemplates.set("deepening", {
      patterns: [
        "Would you like to explore the advanced features of {command}?",
        "How familiar are you with {related_concept}?",
        "Would you like to understand the performance implications of {pattern}?",
        "Shall we dive deeper into {optimization_technique}?",
        "Would you like to see how {command} compares to {alternative}?",
      ],
      triggers: ["basic_understanding_shown", "ready_for_advanced"],
      conditions: ["user_engaged", "basic_concept_grasped"],
    });

    // Exploration questions
    this.questionTemplates.set("exploration", {
      patterns: [
        "Have you considered using {alternative_approach}?",
        "Would you like to explore {related_pattern}?",
        "What other use cases do you have for Redis?",
        "Would you like to see real-world examples of {pattern}?",
        "How does this fit into your overall architecture?",
      ],
      triggers: ["solution_provided", "user_satisfied"],
      conditions: ["learning_momentum", "time_available"],
    });

    // Application questions
    this.questionTemplates.set("application", {
      patterns: [
        "How would you implement this in your specific use case?",
        "What challenges do you anticipate with {implementation}?",
        "Would you like to walk through a practical example?",
        "How would you handle {edge_case} in your application?",
        "What would your testing strategy be for {feature}?",
      ],
      triggers: ["concept_explained", "implementation_discussed"],
      conditions: ["practical_focus", "implementation_ready"],
    });

    // Troubleshooting questions
    this.questionTemplates.set("troubleshooting", {
      patterns: [
        "Are you experiencing any issues with {implementation}?",
        "Have you encountered {common_problem}?",
        "Would you like tips for debugging {issue_type}?",
        "How would you handle {error_scenario}?",
        "What monitoring would you put in place for {feature}?",
      ],
      triggers: ["implementation_mentioned", "problem_solving_context"],
      conditions: ["production_context", "reliability_concerns"],
    });
  }

  /**
   * Initialize hint database
   */
  private initializeHintDatabase(): void {
    // Command-specific hints
    this.hintDatabase.set("GET", [
      {
        id: "get-performance-tip",
        hint: "For high-performance scenarios, consider using MGET to retrieve multiple keys in a single operation",
        type: "performance",
        relevance: 0.8,
        context: {
          applicableWhen: ["multiple_keys", "high_frequency"],
          commandsRelated: ["MGET", "PIPELINE"],
          patternsRelated: ["batching"],
          userExperience: ["intermediate", "advanced"],
          situationTriggers: ["performance_concern", "optimization_discussion"],
        },
        actionable: true,
        resources: [
          {
            type: "example",
            title: "MGET vs Multiple GET Performance Comparison",
            description: "Code example showing performance difference",
            content: "const values = await client.mget([key1, key2, key3]);",
          },
        ],
      },
      {
        id: "get-error-handling",
        hint: "Always handle the case where GET returns null when the key doesn't exist",
        type: "best_practice",
        relevance: 0.9,
        context: {
          applicableWhen: ["error_handling_discussion", "production_code"],
          commandsRelated: ["GET"],
          patternsRelated: ["error_handling"],
          userExperience: ["beginner", "intermediate"],
          situationTriggers: ["null_return_mentioned", "error_handling_focus"],
        },
        actionable: true,
      },
    ]);

    this.hintDatabase.set("SET", [
      {
        id: "set-expiration-tip",
        hint: "Consider using expiration (EX/PX) to prevent memory leaks and implement automatic cleanup",
        type: "best_practice",
        relevance: 0.9,
        context: {
          applicableWhen: ["caching_pattern", "memory_management"],
          commandsRelated: ["SET", "EXPIRE"],
          patternsRelated: ["caching", "ttl"],
          userExperience: ["beginner", "intermediate", "advanced"],
          situationTriggers: ["caching_discussion", "memory_concern"],
        },
        actionable: true,
        resources: [
          {
            type: "example",
            title: "SET with Expiration Examples",
            description: "Different ways to set expiration",
            content:
              "await client.set(key, value, { EX: 3600 }); // 1 hour expiration",
          },
        ],
      },
    ]);

    // Pattern-specific hints
    this.hintDatabase.set("caching", [
      {
        id: "cache-aside-pattern",
        hint: "Implement cache-aside pattern for better data consistency and cache management",
        type: "best_practice",
        relevance: 0.8,
        context: {
          applicableWhen: ["caching_pattern", "data_consistency"],
          commandsRelated: ["GET", "SET", "DEL"],
          patternsRelated: ["caching"],
          userExperience: ["intermediate", "advanced"],
          situationTriggers: ["caching_strategy_discussion"],
        },
        actionable: true,
      },
    ]);

    // Context-sensitive hints
    this.hintDatabase.set("performance", [
      {
        id: "connection-pooling",
        hint: "Use connection pooling to reduce connection overhead in high-throughput applications",
        type: "performance",
        relevance: 0.9,
        context: {
          applicableWhen: ["high_frequency", "production_deployment"],
          commandsRelated: ["*"],
          patternsRelated: ["connection_management"],
          userExperience: ["intermediate", "advanced", "expert"],
          situationTriggers: ["performance_optimization", "scaling_discussion"],
        },
        actionable: true,
      },
    ]);
  }

  /**
   * Initialize question sequences
   */
  private initializeQuestionSequences(): void {
    // Caching learning sequence
    this.questionSequences.set("caching", {
      sequenceId: "caching-sequence",
      theme: "Redis Caching Patterns",
      questions: [
        {
          id: "caching-basics",
          question: "What type of data are you planning to cache?",
          category: "clarification",
          priority: "high",
          context: {
            triggeredBy: "caching_interest",
            relatedConcepts: ["TTL", "eviction_policies"],
            prerequisiteKnowledge: ["basic_redis"],
            difficultyLevel: "beginner",
            timeToAsk: "immediate",
          },
          expectedResponse: "User describes their caching use case",
          learningObjective: "Understand user's caching requirements",
        },
        {
          id: "cache-strategy",
          question:
            "Are you familiar with cache-aside vs write-through patterns?",
          category: "deepening",
          priority: "medium",
          context: {
            triggeredBy: "basic_caching_understood",
            relatedConcepts: ["cache_patterns", "consistency"],
            prerequisiteKnowledge: ["caching_basics"],
            difficultyLevel: "intermediate",
            timeToAsk: "after_explanation",
          },
          expectedResponse:
            "User indicates knowledge level of caching patterns",
          learningObjective: "Assess understanding of caching strategies",
        },
      ],
      progressionLogic: [],
      adaptationPoints: [],
    });
  }

  /**
   * Helper methods for question generation
   */
  private analyzeQuestionNeeds(request: QuestionGenerationRequest): string[] {
    const categories: string[] = [];

    const lastMessage = request.lastMessage;
    const context = request.currentContext;

    // Check for clarification needs
    if (context.confidence < 0.7 || lastMessage.content.includes("?")) {
      categories.push("clarification");
    }

    // Check for deepening opportunities
    if (
      lastMessage.metadata?.responseQuality?.completeness &&
      lastMessage.metadata.responseQuality.completeness > 0.8
    ) {
      categories.push("deepening");
    }

    // Check for exploration potential
    if (
      lastMessage.metadata?.commandsUsed?.length &&
      lastMessage.metadata.commandsUsed.length > 0
    ) {
      categories.push("exploration");
    }

    // Check for application readiness
    if (
      context.intent === "generate" ||
      lastMessage.content.toLowerCase().includes("implement")
    ) {
      categories.push("application");
    }

    // Check for troubleshooting needs
    if (
      lastMessage.content.toLowerCase().includes("error") ||
      lastMessage.content.toLowerCase().includes("problem")
    ) {
      categories.push("troubleshooting");
    }

    return categories;
  }

  private generateCategoryQuestions(
    category: string,
    request: QuestionGenerationRequest,
  ): FollowUpQuestion[] {
    const template = this.questionTemplates.get(category);
    if (!template) return [];

    const questions: FollowUpQuestion[] = [];
    const context = request.currentContext;
    const lastMessage = request.lastMessage;

    // Generate questions based on template patterns
    template.patterns.forEach((pattern, index) => {
      const question = this.fillQuestionTemplate(pattern, lastMessage, context);
      if (question) {
        questions.push({
          id: `${category}-${index}-${Date.now()}`,
          question,
          category: category as any,
          priority: this.calculateQuestionPriority(category, context),
          context: {
            triggeredBy: category,
            relatedConcepts: lastMessage.metadata?.commandsUsed || [],
            prerequisiteKnowledge: [],
            difficultyLevel: context.userExperienceLevel as any,
            timeToAsk: "immediate",
          },
          expectedResponse: `User responds to ${category} question`,
          learningObjective: `${category} learning objective`,
        });
      }
    });

    return questions;
  }

  private fillQuestionTemplate(
    pattern: string,
    message: ConversationMessage,
    context: EnhancedQueryContext,
  ): string | null {
    let question = pattern;

    // Replace placeholders with actual values
    const commands = message.metadata?.commandsUsed || [];
    const patterns = message.metadata?.patternsDetected || [];

    if (commands.length > 0) {
      question = question.replace("{command}", commands[0]);
      question = question.replace(
        "{alternative}",
        this.getAlternativeCommand(commands[0]),
      );
    }

    if (patterns.length > 0) {
      question = question.replace("{pattern}", patterns[0]);
    }

    // Remove unfilled placeholders
    if (question.includes("{") && question.includes("}")) {
      return null; // Skip questions with unfilled placeholders
    }

    return question;
  }

  private rankQuestions(
    questions: FollowUpQuestion[],
    request: QuestionGenerationRequest,
  ): FollowUpQuestion[] {
    return questions.sort((a, b) => {
      const scoreA = this.calculateQuestionScore(a, request);
      const scoreB = this.calculateQuestionScore(b, request);
      return scoreB - scoreA;
    });
  }

  private calculateQuestionScore(
    question: FollowUpQuestion,
    request: QuestionGenerationRequest,
  ): number {
    let score = 0;

    // Priority weight
    const priorityWeights = { critical: 100, high: 75, medium: 50, low: 25 };
    score += priorityWeights[question.priority];

    // Relevance to user experience
    const userExp = request.currentContext.userExperienceLevel;
    if (question.context.difficultyLevel === userExp) {
      score += 30;
    }

    // Learning objective alignment
    if (
      request.sessionGoals.some((goal) =>
        question.learningObjective?.toLowerCase().includes(goal.toLowerCase()),
      )
    ) {
      score += 40;
    }

    return score;
  }

  private applyLearningProfileFilters(
    questions: FollowUpQuestion[],
    profile: UserLearningProfile,
  ): FollowUpQuestion[] {
    return questions.filter((question) => {
      // Filter by experience level
      const levelMatch =
        question.context.difficultyLevel === profile.experienceLevel ||
        this.isAppropriateLevel(
          question.context.difficultyLevel,
          profile.experienceLevel,
        );

      // Filter by learning goals
      const goalMatch =
        profile.learningGoals.length === 0 ||
        profile.learningGoals.some((goal) =>
          question.learningObjective
            ?.toLowerCase()
            .includes(goal.toLowerCase()),
        );

      return levelMatch && goalMatch;
    });
  }

  private isAppropriateLevel(
    questionLevel: string,
    userLevel: string,
  ): boolean {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const questionIndex = levels.indexOf(questionLevel);
    const userIndex = levels.indexOf(userLevel);

    // Allow questions within one level of user's level
    return Math.abs(questionIndex - userIndex) <= 1;
  }

  /**
   * Helper methods for hint generation
   */
  private getCommandHints(
    command: string,
    request: HintGenerationRequest,
  ): ContextualHint[] {
    const hints = this.hintDatabase.get(command) || [];
    return hints.filter((hint) => this.isHintApplicable(hint, request));
  }

  private getPatternHints(
    pattern: string,
    request: HintGenerationRequest,
  ): ContextualHint[] {
    const hints = this.hintDatabase.get(pattern) || [];
    return hints.filter((hint) => this.isHintApplicable(hint, request));
  }

  private getContextSensitiveHints(
    request: HintGenerationRequest,
  ): ContextualHint[] {
    const hints: ContextualHint[] = [];

    // Performance hints
    if (
      request.conversationState.phase === "deep_dive" ||
      request.currentQuery.toLowerCase().includes("performance")
    ) {
      hints.push(...(this.hintDatabase.get("performance") || []));
    }

    return hints.filter((hint) => this.isHintApplicable(hint, request));
  }

  private isHintApplicable(
    hint: ContextualHint,
    request: HintGenerationRequest,
  ): boolean {
    const userExp = request.userContext.userExperienceLevel;

    // Check user experience level
    if (!hint.context.userExperience.includes(userExp)) {
      return false;
    }

    // Check situation triggers
    const queryLower = request.currentQuery.toLowerCase();
    const triggerMatch = hint.context.situationTriggers.some((trigger) =>
      queryLower.includes(trigger.replace("_", " ")),
    );

    return triggerMatch || hint.context.situationTriggers.length === 0;
  }

  private calculateHintRelevance(
    hint: ContextualHint,
    request: HintGenerationRequest,
  ): number {
    let relevance = hint.relevance;

    // Boost relevance for command matches
    const commandMatch = hint.context.commandsRelated.some(
      (cmd) => request.detectedCommands.includes(cmd) || cmd === "*",
    );
    if (commandMatch) relevance += 0.2;

    // Boost relevance for pattern matches
    const patternMatch = hint.context.patternsRelated.some((pattern) =>
      request.detectedPatterns.includes(pattern),
    );
    if (patternMatch) relevance += 0.3;

    return Math.min(1.0, relevance);
  }

  /**
   * Helper methods for learning steps
   */
  private extractCoveredTopics(history: ConversationMessage[]): string[] {
    const topics = new Set<string>();

    history.forEach((msg) => {
      if (msg.metadata?.commandsUsed) {
        msg.metadata.commandsUsed.forEach((cmd) => topics.add(cmd));
      }
      if (msg.metadata?.patternsDetected) {
        msg.metadata.patternsDetected.forEach((pattern) => topics.add(pattern));
      }
    });

    return Array.from(topics);
  }

  private identifySkillGaps(
    coveredTopics: string[],
    profile: UserLearningProfile,
  ): string[] {
    const allImportantTopics = [
      "GET",
      "SET",
      "HGET",
      "HSET",
      "LPUSH",
      "RPUSH",
      "ZADD",
      "ZRANGE",
      "caching",
      "sessions",
      "rate_limiting",
      "pub_sub",
    ];

    return allImportantTopics.filter(
      (topic) =>
        !coveredTopics.includes(topic) &&
        !profile.knownConcepts.includes(topic),
    );
  }

  private suggestNextConcepts(
    coveredTopics: string[],
    profile: UserLearningProfile,
  ): string[] {
    const conceptGraph: Record<string, string[]> = {
      GET: ["MGET", "caching", "performance_optimization"],
      SET: ["TTL", "expiration", "memory_management"],
      HSET: ["hash_optimization", "object_storage"],
      caching: ["cache_patterns", "eviction_policies"],
      sessions: ["authentication", "state_management"],
    };

    const nextConcepts = new Set<string>();

    coveredTopics.forEach((topic) => {
      const related = conceptGraph[topic] || [];
      related.forEach((concept) => {
        if (
          !coveredTopics.includes(concept) &&
          !profile.knownConcepts.includes(concept)
        ) {
          nextConcepts.add(concept);
        }
      });
    });

    return Array.from(nextConcepts);
  }

  private generateImmediateSteps(
    gaps: string[],
    profile: UserLearningProfile,
  ): string[] {
    return gaps.slice(0, 3).map((gap) => `Learn about ${gap}`);
  }

  private generateShortTermSteps(
    concepts: string[],
    profile: UserLearningProfile,
  ): string[] {
    return concepts.slice(0, 5).map((concept) => `Explore ${concept}`);
  }

  private generateLongTermSteps(profile: UserLearningProfile): string[] {
    return [
      "Master advanced Redis patterns",
      "Learn Redis cluster management",
      "Explore Redis modules and extensions",
      "Study Redis performance optimization",
    ];
  }

  private generatePracticeOpportunities(
    topics: string[],
    profile: UserLearningProfile,
  ): string[] {
    return [
      `Build a caching layer using ${topics[0] || "Redis"}`,
      "Implement a session management system",
      "Create a real-time leaderboard",
      "Build a rate limiting service",
    ];
  }

  /**
   * Utility methods
   */
  private getAlternativeCommand(command: string): string {
    const alternatives: Record<string, string> = {
      GET: "MGET",
      SET: "MSET",
      HGET: "HGETALL",
      LPUSH: "RPUSH",
      ZADD: "ZRANGE",
    };

    return alternatives[command.toUpperCase()] || "alternative commands";
  }

  private calculateQuestionPriority(
    category: string,
    context: EnhancedQueryContext,
  ): "low" | "medium" | "high" | "critical" {
    if (category === "clarification" && context.confidence < 0.5) {
      return "critical";
    }
    if (category === "troubleshooting") {
      return "high";
    }
    if (category === "deepening" || category === "application") {
      return "medium";
    }
    return "low";
  }

  private createDefaultSequence(topic: string): QuestionSequence {
    return {
      sequenceId: `default-${topic}`,
      theme: topic,
      questions: [],
      progressionLogic: [],
      adaptationPoints: [],
    };
  }

  private adaptQuestionsToProfile(
    questions: FollowUpQuestion[],
    profile: UserLearningProfile,
  ): FollowUpQuestion[] {
    return questions.map((q) => ({
      ...q,
      context: {
        ...q.context,
        difficultyLevel: profile.experienceLevel as any,
      },
    }));
  }

  private createProgressionLogic(
    questions: FollowUpQuestion[],
    profile: UserLearningProfile,
  ): ProgressionRule[] {
    return [];
  }

  private defineAdaptationPoints(
    topic: string,
    profile: UserLearningProfile,
  ): AdaptationPoint[] {
    return [];
  }
}

interface QuestionTemplate {
  patterns: string[];
  triggers: string[];
  conditions: string[];
}

export default FollowUpQuestionGenerator;

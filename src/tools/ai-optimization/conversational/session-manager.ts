/**
 * Conversational Session Management System
 * Provides query history tracking and contextual conversation management for AI agents
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface ConversationMessage {
  id: string;
  timestamp: Date;
  type: "user" | "assistant" | "system";
  content: string;
  context?: EnhancedQueryContext;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  commandsUsed?: string[];
  patternsDetected?: string[];
  toolsInvoked?: string[];
  responseQuality?: ResponseQuality;
  userSatisfaction?: UserSatisfaction;
  followUpGenerated?: boolean;
}

export interface ResponseQuality {
  accuracy: number; // 0-1
  completeness: number; // 0-1
  helpfulness: number; // 0-1
  clarity: number; // 0-1
  relevance: number; // 0-1
  overallScore: number; // 0-1
}

export interface UserSatisfaction {
  rating?: number; // 1-5
  feedback?: string;
  resolved?: boolean;
  followUpNeeded?: boolean;
}

export interface ConversationTurn {
  turnId: string;
  userMessage: ConversationMessage;
  assistantResponse: ConversationMessage;
  contextEvolution: ContextChange[];
  learningPoints: LearningPoint[];
  nextSuggestions: string[];
}

export interface ContextChange {
  type:
    | "intent_clarification"
    | "expertise_level"
    | "domain_knowledge"
    | "preference_update";
  before: any;
  after: any;
  reason: string;
  confidence: number;
}

export interface LearningPoint {
  concept: string;
  description: string;
  importance: "low" | "medium" | "high";
  mastery: "unknown" | "learning" | "familiar" | "expert";
  examples: string[];
  relatedConcepts: string[];
}

export interface ConversationSummary {
  sessionId: string;
  totalMessages: number;
  duration: number;
  primaryTopics: string[];
  commandsCovered: string[];
  learningProgression: LearningProgression;
  unresolvedQuestions: string[];
  recommendedNextSteps: string[];
}

export interface LearningProgression {
  startingLevel: string;
  currentLevel: string;
  conceptsLearned: string[];
  skillsAcquired: string[];
  areasForImprovement: string[];
  nextLearningGoals: string[];
}

export interface SessionPreferences {
  preferredResponseLength: "brief" | "moderate" | "detailed";
  codeExamplePreference: "minimal" | "practical" | "comprehensive";
  explanationStyle: "technical" | "conversational" | "tutorial";
  progressTracking: boolean;
  interactivePrompts: boolean;
}

export class ConversationalSession {
  private sessionId: string;
  private startTime: Date;
  private lastActivity: Date;
  private messages: ConversationMessage[] = [];
  private turns: ConversationTurn[] = [];
  private currentContext: EnhancedQueryContext;
  private preferences: SessionPreferences;
  private learningHistory: LearningPoint[] = [];
  private conversationMemory: ConversationMemory;

  constructor(
    sessionId: string,
    initialContext: EnhancedQueryContext,
    preferences?: Partial<SessionPreferences>,
  ) {
    this.sessionId = sessionId;
    this.startTime = new Date();
    this.lastActivity = new Date();
    this.currentContext = initialContext;
    this.preferences = this.initializePreferences(preferences);
    this.conversationMemory = new ConversationMemory();
  }

  /**
   * Add a message to the conversation
   */
  addMessage(
    type: "user" | "assistant" | "system",
    content: string,
    context?: EnhancedQueryContext,
    metadata?: MessageMetadata,
  ): string {
    const messageId = this.generateMessageId();

    const message: ConversationMessage = {
      id: messageId,
      timestamp: new Date(),
      type,
      content,
      context: context || this.currentContext,
      metadata,
    };

    this.messages.push(message);
    this.lastActivity = new Date();

    // Update context if provided
    if (context) {
      this.updateContext(context);
    }

    // Process learning opportunities
    if (type === "assistant" && metadata) {
      // this.processLearningOpportunities(message); // Method not available
    }

    return messageId;
  }

  /**
   * Create a conversation turn (user message + assistant response)
   */
  createTurn(
    userContent: string,
    assistantContent: string,
    userContext?: EnhancedQueryContext,
    responseMetadata?: MessageMetadata,
  ): string {
    const turnId = this.generateTurnId();

    const userMessage = this.addMessage("user", userContent, userContext);
    const assistantMessage = this.addMessage(
      "assistant",
      assistantContent,
      userContext,
      responseMetadata,
    );

    const userMsg = this.messages.find((m) => m.id === userMessage)!;
    const assistantMsg = this.messages.find((m) => m.id === assistantMessage)!;

    const contextEvolution = this.analyzeContextEvolution(
      userMsg,
      assistantMsg,
    );
    const learningPoints = this.extractLearningPoints(userMsg, assistantMsg);
    const nextSuggestions = this.generateNextSuggestions(userMsg, assistantMsg);

    const turn: ConversationTurn = {
      turnId,
      userMessage: userMsg,
      assistantResponse: assistantMsg,
      contextEvolution,
      learningPoints,
      nextSuggestions,
    };

    this.turns.push(turn);
    this.learningHistory.push(...learningPoints);

    return turnId;
  }

  /**
   * Get conversation history with optional filtering
   */
  getHistory(options?: {
    messageType?: "user" | "assistant" | "system";
    lastN?: number;
    since?: Date;
    includeMetadata?: boolean;
  }): ConversationMessage[] {
    let history = [...this.messages];

    if (options?.messageType) {
      history = history.filter((msg) => msg.type === options.messageType);
    }

    if (options?.since) {
      history = history.filter((msg) => msg.timestamp >= options.since!);
    }

    if (options?.lastN) {
      history = history.slice(-options.lastN);
    }

    if (!options?.includeMetadata) {
      history = history.map((msg) => ({
        ...msg,
        metadata: undefined,
      }));
    }

    return history;
  }

  /**
   * Get recent context for AI agent
   */
  getRecentContext(lookback: number = 5): {
    recentMessages: ConversationMessage[];
    contextSummary: string;
    currentIntent: string;
    userExpertise: string;
    relevantHistory: string[];
  } {
    const recentMessages = this.messages.slice(-lookback);

    return {
      recentMessages,
      contextSummary: this.generateContextSummary(recentMessages),
      currentIntent: this.currentContext.intent,
      userExpertise: this.currentContext.userExperienceLevel,
      relevantHistory: this.extractRelevantHistory(recentMessages),
    };
  }

  /**
   * Update session preferences
   */
  updatePreferences(newPreferences: Partial<SessionPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }

  /**
   * Get learning progression summary
   */
  getLearningProgression(): LearningProgression {
    const conceptsLearned = [
      ...new Set(this.learningHistory.map((lp) => lp.concept)),
    ];
    const skillsAcquired = this.learningHistory
      .filter((lp) => lp.mastery === "familiar" || lp.mastery === "expert")
      .map((lp) => lp.concept);

    const areasForImprovement = this.learningHistory
      .filter((lp) => lp.mastery === "learning" || lp.mastery === "unknown")
      .map((lp) => lp.concept);

    return {
      startingLevel: this.currentContext.userExperienceLevel,
      currentLevel: this.calculateCurrentLevel(),
      conceptsLearned,
      skillsAcquired,
      areasForImprovement,
      nextLearningGoals: this.generateNextLearningGoals(),
    };
  }

  /**
   * Generate conversation summary
   */
  generateSummary(): ConversationSummary {
    const duration = this.lastActivity.getTime() - this.startTime.getTime();
    const primaryTopics = this.extractPrimaryTopics();
    const commandsCovered = this.extractCommandsCovered();
    const unresolvedQuestions = this.identifyUnresolvedQuestions();
    const recommendedNextSteps = this.generateRecommendedNextSteps();

    return {
      sessionId: this.sessionId,
      totalMessages: this.messages.length,
      duration,
      primaryTopics,
      commandsCovered,
      learningProgression: this.getLearningProgression(),
      unresolvedQuestions,
      recommendedNextSteps,
    };
  }

  /**
   * Check if session should be continued or ended
   */
  shouldContinueSession(): {
    continue: boolean;
    reason: string;
    suggestions: string[];
  } {
    const timeSinceLastActivity = Date.now() - this.lastActivity.getTime();
    const maxInactivity = 30 * 60 * 1000; // 30 minutes

    if (timeSinceLastActivity > maxInactivity) {
      return {
        continue: false,
        reason: "Session inactive for too long",
        suggestions: [
          "Start a new session when you return",
          "Previous conversation history will be preserved",
        ],
      };
    }

    const unresolvedQuestions = this.identifyUnresolvedQuestions();
    if (unresolvedQuestions.length > 0) {
      return {
        continue: true,
        reason: "Unresolved questions remain",
        suggestions: [
          "Continue exploring these topics",
          "Ask for clarification on complex concepts",
        ],
      };
    }

    const learningGoals = this.generateNextLearningGoals();
    if (learningGoals.length > 0) {
      return {
        continue: true,
        reason: "Learning opportunities available",
        suggestions: learningGoals,
      };
    }

    return {
      continue: false,
      reason: "Learning objectives completed",
      suggestions: [
        "Explore advanced topics",
        "Practice implementing learned concepts",
        "Start a new focused session",
      ],
    };
  }

  /**
   * Private helper methods
   */
  private initializePreferences(
    preferences?: Partial<SessionPreferences>,
  ): SessionPreferences {
    return {
      preferredResponseLength: "moderate",
      codeExamplePreference: "practical",
      explanationStyle: "conversational",
      progressTracking: true,
      interactivePrompts: true,
      ...preferences,
    };
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  private generateTurnId(): string {
    return `turn-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  private updateContext(newContext: EnhancedQueryContext): void {
    // Update user experience level based on conversation history
    if (this.shouldUpgradeExperience(newContext)) {
      this.currentContext.userExperienceLevel =
        this.calculateNewExperience() as "beginner" | "intermediate" | "expert";
    }

    // Merge contextual data
    this.currentContext = {
      ...this.currentContext,
      ...newContext,
      // contextualData: {
      //   ...this.currentContext.contextualData,
      //   ...newContext.contextualData,
      // },
    };
  }

  private shouldUpgradeExperience(context: EnhancedQueryContext): boolean {
    const expertAnswers = this.messages.filter(
      (msg) =>
        msg.type === "user" &&
        msg.metadata?.responseQuality?.accuracy &&
        msg.metadata.responseQuality.accuracy > 0.8,
    ).length;

    return (
      expertAnswers > 5 &&
      this.currentContext.userExperienceLevel === "beginner"
    );
  }

  private calculateNewExperience(): string {
    const conceptsLearned = this.learningHistory.length;

    if (conceptsLearned > 15) return "expert";
    if (conceptsLearned > 8) return "intermediate";
    if (conceptsLearned > 3) return "beginner-plus";
    return "beginner";
  }

  private analyzeContextEvolution(
    userMsg: ConversationMessage,
    assistantMsg: ConversationMessage,
  ): ContextChange[] {
    const changes: ContextChange[] = [];

    // Check for intent clarification
    if (userMsg.context?.intent !== this.currentContext.intent) {
      changes.push({
        type: "intent_clarification",
        before: this.currentContext.intent,
        after: userMsg.context?.intent,
        reason: "User query indicates different intent",
        confidence: 0.8,
      });
    }

    return changes;
  }

  private extractLearningPoints(
    userMsg: ConversationMessage,
    assistantMsg: ConversationMessage,
  ): LearningPoint[] {
    const learningPoints: LearningPoint[] = [];

    // Extract concepts from assistant response
    const commands = assistantMsg.metadata?.commandsUsed || [];
    const patterns = assistantMsg.metadata?.patternsDetected || [];

    commands.forEach((command) => {
      learningPoints.push({
        concept: `Redis ${command} command`,
        description: `Understanding the ${command} command usage and syntax`,
        importance: this.getCommandImportance(command),
        mastery: this.assessConceptMastery(command),
        examples: [`${command} command example`],
        relatedConcepts: this.getRelatedCommands(command),
      });
    });

    patterns.forEach((pattern) => {
      learningPoints.push({
        concept: `${pattern} pattern`,
        description: `Understanding the ${pattern} usage pattern`,
        importance: "medium",
        mastery: "learning",
        examples: [`${pattern} pattern example`],
        relatedConcepts: [],
      });
    });

    return learningPoints;
  }

  private generateNextSuggestions(
    userMsg: ConversationMessage,
    assistantMsg: ConversationMessage,
  ): string[] {
    const suggestions: string[] = [];

    const commands = assistantMsg.metadata?.commandsUsed || [];
    if (commands.length > 0) {
      suggestions.push(
        `Would you like to explore advanced ${commands[0]} usage patterns?`,
      );
      suggestions.push(
        `How about learning about performance optimization for ${commands[0]}?`,
      );
    }

    if (assistantMsg.metadata?.patternsDetected?.length) {
      suggestions.push(
        "Would you like to see real-world examples of this pattern?",
      );
      suggestions.push(
        "Shall we explore alternative patterns for this use case?",
      );
    }

    suggestions.push("Do you have any questions about the implementation?");
    suggestions.push("Would you like to practice with a hands-on example?");

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  private generateContextSummary(messages: ConversationMessage[]): string {
    const topics = messages
      .filter((msg) => msg.metadata?.commandsUsed)
      .flatMap((msg) => msg.metadata!.commandsUsed!)
      .reduce(
        (acc, cmd) => {
          acc[cmd] = (acc[cmd] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topTopics = Object.entries(topics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);

    return `Recent discussion focused on: ${topTopics.join(", ")}`;
  }

  private extractRelevantHistory(messages: ConversationMessage[]): string[] {
    return messages
      .filter((msg) => msg.type === "assistant")
      .map((msg) => msg.content)
      .slice(-3); // Last 3 assistant responses
  }

  private calculateCurrentLevel(): string {
    const totalConcepts = this.learningHistory.length;
    const masteredConcepts = this.learningHistory.filter(
      (lp) => lp.mastery === "familiar" || lp.mastery === "expert",
    ).length;

    const masteryRatio =
      totalConcepts > 0 ? masteredConcepts / totalConcepts : 0;

    if (masteryRatio > 0.8) return "expert";
    if (masteryRatio > 0.6) return "advanced";
    if (masteryRatio > 0.4) return "intermediate";
    return "beginner";
  }

  private generateNextLearningGoals(): string[] {
    const goals: string[] = [];

    const unknownConcepts = this.learningHistory.filter(
      (lp) => lp.mastery === "unknown",
    );
    if (unknownConcepts.length > 0) {
      goals.push(`Learn about ${unknownConcepts[0].concept}`);
    }

    const learningConcepts = this.learningHistory.filter(
      (lp) => lp.mastery === "learning",
    );
    if (learningConcepts.length > 0) {
      goals.push(`Practice ${learningConcepts[0].concept}`);
    }

    goals.push("Explore advanced Redis patterns");
    goals.push("Learn about performance optimization");

    return goals.slice(0, 3);
  }

  private extractPrimaryTopics(): string[] {
    const topicCounts = this.messages
      .filter((msg) => msg.metadata?.commandsUsed)
      .flatMap((msg) => msg.metadata!.commandsUsed!)
      .reduce(
        (acc, cmd) => {
          acc[cmd] = (acc[cmd] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  private extractCommandsCovered(): string[] {
    return [
      ...new Set(
        this.messages
          .filter((msg) => msg.metadata?.commandsUsed)
          .flatMap((msg) => msg.metadata!.commandsUsed!),
      ),
    ];
  }

  private identifyUnresolvedQuestions(): string[] {
    const questions: string[] = [];

    this.messages
      .filter((msg) => msg.type === "user" && msg.content.includes("?"))
      .forEach((msg) => {
        // Check if question was adequately answered in subsequent responses
        const subsequentResponses = this.messages
          .filter(
            (response) =>
              response.timestamp > msg.timestamp &&
              response.type === "assistant",
          )
          .slice(0, 2);

        const adequatelyAnswered = subsequentResponses.some(
          (response) =>
            response.metadata?.responseQuality?.completeness &&
            response.metadata.responseQuality.completeness > 0.7,
        );

        if (!adequatelyAnswered) {
          questions.push(msg.content);
        }
      });

    return questions.slice(0, 5); // Limit to 5 unresolved questions
  }

  private generateRecommendedNextSteps(): string[] {
    const steps: string[] = [];

    const unresolved = this.identifyUnresolvedQuestions();
    if (unresolved.length > 0) {
      steps.push("Revisit unresolved questions for clarification");
    }

    const learningGoals = this.generateNextLearningGoals();
    steps.push(...learningGoals);

    steps.push("Practice implementing learned concepts");
    steps.push("Explore related advanced topics");

    return steps.slice(0, 5);
  }

  private getCommandImportance(command: string): "low" | "medium" | "high" {
    const highImportance = ["GET", "SET", "HGET", "HSET", "LPUSH", "RPUSH"];
    const mediumImportance = [
      "DEL",
      "EXISTS",
      "EXPIRE",
      "TTL",
      "ZADD",
      "ZRANGE",
    ];

    if (highImportance.includes(command.toUpperCase())) return "high";
    if (mediumImportance.includes(command.toUpperCase())) return "medium";
    return "low";
  }

  private assessConceptMastery(
    concept: string,
  ): "unknown" | "learning" | "familiar" | "expert" {
    const previousLearning = this.learningHistory.filter((lp) =>
      lp.concept.includes(concept),
    );

    if (previousLearning.length === 0) return "unknown";
    if (previousLearning.length < 3) return "learning";
    if (previousLearning.length < 6) return "familiar";
    return "expert";
  }

  private getRelatedCommands(command: string): string[] {
    const relationships: Record<string, string[]> = {
      GET: ["SET", "MGET", "GETSET"],
      SET: ["GET", "MSET", "SETEX"],
      HGET: ["HSET", "HGETALL", "HMGET"],
      HSET: ["HGET", "HMSET", "HDEL"],
      LPUSH: ["RPUSH", "LPOP", "LRANGE"],
      ZADD: ["ZRANGE", "ZRANK", "ZREM"],
    };

    return relationships[command.toUpperCase()] || [];
  }

  /**
   * Getters
   */
  get id(): string {
    return this.sessionId;
  }
  get start(): Date {
    return this.startTime;
  }
  get lastActive(): Date {
    return this.lastActivity;
  }
  get messageCount(): number {
    return this.messages.length;
  }
  get turnCount(): number {
    return this.turns.length;
  }
  get context(): EnhancedQueryContext {
    return this.currentContext;
  }
  get sessionPreferences(): SessionPreferences {
    return this.preferences;
  }
}

/**
 * Conversation Memory for maintaining context across messages
 */
class ConversationMemory {
  private shortTermMemory: Map<string, any> = new Map();
  private longTermMemory: Map<string, any> = new Map();
  private workingMemory: Record<string, any> = {};

  store(
    key: string,
    value: any,
    type: "short" | "long" | "working" = "short",
  ): void {
    switch (type) {
      case "short":
        this.shortTermMemory.set(key, value);
        break;
      case "long":
        this.longTermMemory.set(key, value);
        break;
      case "working":
        this.workingMemory[key] = value;
        break;
    }
  }

  retrieve(key: string, type?: "short" | "long" | "working"): any {
    if (type) {
      switch (type) {
        case "short":
          return this.shortTermMemory.get(key);
        case "long":
          return this.longTermMemory.get(key);
        case "working":
          return this.workingMemory[key];
      }
    }

    // Search all memory types if no type specified
    return (
      this.workingMemory[key] ||
      this.shortTermMemory.get(key) ||
      this.longTermMemory.get(key)
    );
  }

  clear(type?: "short" | "long" | "working"): void {
    if (type) {
      switch (type) {
        case "short":
          this.shortTermMemory.clear();
          break;
        case "long":
          this.longTermMemory.clear();
          break;
        case "working":
          this.workingMemory = {};
          break;
      }
    } else {
      this.shortTermMemory.clear();
      this.longTermMemory.clear();
      this.workingMemory = {};
    }
  }
}

export default ConversationalSession;

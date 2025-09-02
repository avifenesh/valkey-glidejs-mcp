/**
 * Conversational Interface Framework
 * Provides comprehensive conversation management with follow-up questions and progression tracking
 */

import ConversationalSession, {
  type ConversationMessage,
  type ConversationTurn,
  type ConversationSummary,
  type SessionPreferences,
  type LearningProgression,
} from "./session-manager.js";

import FollowUpQuestionGenerator, {
  type FollowUpQuestion,
  type ContextualHint,
  type QuestionGenerationRequest,
  type HintGenerationRequest,
  type UserLearningProfile,
  type QuestionSequence,
} from "./followup-generator.js";

import ProgressionSuggestionEngine, {
  type LearningPath,
  type ProgressionSuggestion,
  type SkillAssessment,
  type LearningMilestone,
  type ProgressMetrics,
} from "./progression-engine.js";

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";

export interface ConversationalRequest {
  sessionId?: string;
  userMessage: string;
  context: EnhancedQueryContext;
  preferences?: Partial<SessionPreferences>;
  requestType: "chat" | "learn" | "explore" | "practice" | "assess";
}

export interface ConversationalResponse {
  sessionId: string;
  response: string;
  conversationTurn: ConversationTurn;
  followUpQuestions: FollowUpQuestion[];
  contextualHints: ContextualHint[];
  progressionSuggestions: ProgressionSuggestion[];
  learningInsights: LearningInsight[];
  nextSteps: string[];
  sessionSummary?: ConversationSummary;
}

export interface LearningInsight {
  type:
    | "skill_progress"
    | "knowledge_gap"
    | "learning_opportunity"
    | "mastery_indicator";
  insight: string;
  confidence: number;
  actionable: boolean;
  relatedConcepts: string[];
  timeframe: "immediate" | "short_term" | "long_term";
}

export interface ConversationalContext {
  currentSession: ConversationalSession | null;
  userProfile: UserLearningProfile;
  learningPath?: LearningPath;
  conversationGoals: string[];
  adaptationRules: ContextAdaptationRule[];
}

export interface ContextAdaptationRule {
  trigger: string;
  condition: string;
  adaptation: string;
  priority: number;
}

export interface ConversationAnalytics {
  totalSessions: number;
  averageSessionDuration: number;
  topicsExplored: string[];
  learningProgress: LearningProgressAnalytics;
  engagementMetrics: EngagementMetrics;
  effectivenessScores: EffectivenessScore[];
}

export interface LearningProgressAnalytics {
  conceptsLearned: number;
  skillsAcquired: string[];
  milestoneProgress: number;
  learningVelocity: number;
  retentionRate: number;
}

export interface EngagementMetrics {
  questionsAsked: number;
  hintsUsed: number;
  exercisesCompleted: number;
  sessionContinuationRate: number;
  satisfactionScore: number;
}

export interface EffectivenessScore {
  metric: string;
  score: number;
  benchmark: number;
  trend: "improving" | "stable" | "declining";
}

export class ConversationalInterface {
  private sessions: Map<string, ConversationalSession> = new Map();
  private followUpGenerator: FollowUpQuestionGenerator;
  private progressionEngine: ProgressionSuggestionEngine;
  private userProfiles: Map<string, UserLearningProfile> = new Map();
  private conversationAnalytics: Map<string, ConversationAnalytics> = new Map();

  constructor() {
    this.followUpGenerator = new FollowUpQuestionGenerator();
    this.progressionEngine = new ProgressionSuggestionEngine();
  }

  /**
   * Process conversational request and generate comprehensive response
   */
  async processConversation(
    request: ConversationalRequest,
  ): Promise<ConversationalResponse> {
    // Get or create session
    const session = await this.getOrCreateSession(request);

    // Update user profile based on conversation
    const userProfile = this.updateUserProfile(session.id, request);

    // Generate assistant response (this would integrate with your main response system)
    const assistantResponse = await this.generateAssistantResponse(
      request,
      session,
      userProfile,
    );

    // Create conversation turn
    const turnId = session.createTurn(
      request.userMessage,
      assistantResponse.content,
      request.context,
      assistantResponse.metadata,
    );

    const turn = session.getHistory().find((t) => t.id === turnId)!;

    // Generate follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(
      session,
      userProfile,
      request.context,
    );

    // Generate contextual hints
    const contextualHints = this.generateContextualHints(request, session);

    // Generate progression suggestions
    const progressionSuggestions = this.generateProgressionSuggestions(
      session,
      userProfile,
      request.context,
    );

    // Extract learning insights
    const learningInsights = this.extractLearningInsights(
      session,
      turn as any,
      userProfile,
    );

    // Generate next steps
    const nextSteps = this.generateNextSteps(
      turn as any,
      followUpQuestions,
      progressionSuggestions,
    );

    // Check if session should be summarized
    const sessionSummary = this.shouldSummarizeSession(session)
      ? session.generateSummary()
      : undefined;

    return {
      sessionId: session.id,
      response: assistantResponse.content,
      conversationTurn: turn as any,
      followUpQuestions,
      contextualHints,
      progressionSuggestions,
      learningInsights,
      nextSteps,
      sessionSummary,
    };
  }

  /**
   * Start a new learning-focused conversation
   */
  async startLearningConversation(
    initialContext: EnhancedQueryContext,
    learningGoals: string[],
    preferences?: Partial<SessionPreferences>,
  ): Promise<{
    sessionId: string;
    welcomeMessage: string;
    suggestedPath: LearningPath;
    initialQuestions: FollowUpQuestion[];
  }> {
    const sessionId = this.generateSessionId();

    // Create user profile
    const userProfile: UserLearningProfile = {
      experienceLevel: initialContext.userExperienceLevel,
      preferredLearningStyle: "hands-on",
      knownConcepts: [],
      learningGoals,
      struggleAreas: [],
      interests: [],
    };

    // Create personalized learning path
    const suggestedPath = this.progressionEngine.createPersonalizedPath(
      userProfile,
      learningGoals,
      "moderate pace",
    );

    // Create session
    const session = new ConversationalSession(
      sessionId,
      initialContext,
      preferences,
    );
    this.sessions.set(sessionId, session);
    this.userProfiles.set(sessionId, userProfile);

    // Generate welcome message
    const welcomeMessage = this.generateWelcomeMessage(
      userProfile,
      suggestedPath,
    );

    // Generate initial questions
    const initialQuestions = this.generateInitialQuestions(
      userProfile,
      learningGoals,
    );

    return {
      sessionId,
      welcomeMessage,
      suggestedPath,
      initialQuestions,
    };
  }

  /**
   * Get conversation analytics for a user
   */
  getConversationAnalytics(userId: string): ConversationAnalytics | undefined {
    return this.conversationAnalytics.get(userId);
  }

  /**
   * Update user learning profile based on conversation data
   */
  updateUserProfile(
    sessionId: string,
    request: ConversationalRequest,
  ): UserLearningProfile {
    let profile = this.userProfiles.get(sessionId);

    if (!profile) {
      profile = {
        experienceLevel: request.context.userExperienceLevel,
        preferredLearningStyle: "hands-on",
        knownConcepts: [],
        learningGoals: [],
        struggleAreas: [],
        interests: [],
      };
    }

    // Update known concepts based on demonstrated knowledge
    const session = this.sessions.get(sessionId);
    if (session) {
      const demonstratedConcepts = this.extractDemonstratedConcepts(session);
      profile.knownConcepts = [
        ...new Set([...profile.knownConcepts, ...demonstratedConcepts]),
      ];
    }

    // Update experience level if progression is detected
    profile.experienceLevel = this.assessCurrentExperienceLevel(
      profile,
      session || null,
    );

    this.userProfiles.set(sessionId, profile);
    return profile;
  }

  /**
   * Generate comprehensive session report
   */
  generateSessionReport(sessionId: string): SessionReport {
    const session = this.sessions.get(sessionId);
    const userProfile = this.userProfiles.get(sessionId);

    if (!session || !userProfile) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const conversationSummary = session.generateSummary();
    const learningProgression = session.getLearningProgression();

    // Analyze conversation effectiveness
    const effectivenessAnalysis = this.analyzeConversationEffectiveness(
      session,
      userProfile,
    );

    // Generate recommendations for improvement
    const improvementRecommendations = this.generateImprovementRecommendations(
      session,
      effectivenessAnalysis,
    );

    return {
      sessionId,
      conversationSummary,
      learningProgression,
      effectivenessAnalysis,
      improvementRecommendations,
      generatedAt: new Date(),
    };
  }

  /**
   * Private helper methods
   */
  private async getOrCreateSession(
    request: ConversationalRequest,
  ): Promise<ConversationalSession> {
    if (request.sessionId && this.sessions.has(request.sessionId)) {
      return this.sessions.get(request.sessionId)!;
    }

    const sessionId = request.sessionId || this.generateSessionId();
    const session = new ConversationalSession(
      sessionId,
      request.context,
      request.preferences,
    );
    this.sessions.set(sessionId, session);

    return session;
  }

  private async generateAssistantResponse(
    request: ConversationalRequest,
    session: ConversationalSession,
    userProfile: UserLearningProfile,
  ): Promise<{ content: string; metadata: any }> {
    // This would integrate with your main response generation system
    // For now, return a placeholder response
    return {
      content: `Thank you for your question about ${request.userMessage}. Based on your ${userProfile.experienceLevel} level, here's what I can help you with...`,
      metadata: {
        commandsUsed: this.extractCommandsFromMessage(request.userMessage),
        patternsDetected: this.extractPatternsFromMessage(request.userMessage),
        responseQuality: {
          accuracy: 0.9,
          completeness: 0.8,
          helpfulness: 0.9,
          clarity: 0.8,
          relevance: 0.9,
          overallScore: 0.86,
        },
      },
    };
  }

  private generateFollowUpQuestions(
    session: ConversationalSession,
    userProfile: UserLearningProfile,
    context: EnhancedQueryContext,
  ): FollowUpQuestion[] {
    const recentHistory = session.getHistory({ lastN: 5 });
    const lastMessage = recentHistory[recentHistory.length - 1];

    if (!lastMessage) return [];

    const request: QuestionGenerationRequest = {
      lastMessage,
      conversationHistory: recentHistory,
      currentContext: context,
      userLearningProfile: userProfile,
      sessionGoals: userProfile.learningGoals,
    };

    return this.followUpGenerator.generateFollowUpQuestions(request);
  }

  private generateContextualHints(
    request: ConversationalRequest,
    session: ConversationalSession,
  ): ContextualHint[] {
    const hintRequest: HintGenerationRequest = {
      currentQuery: request.userMessage,
      detectedCommands: this.extractCommandsFromMessage(request.userMessage),
      detectedPatterns: this.extractPatternsFromMessage(request.userMessage),
      userContext: request.context,
      conversationState: {
        phase: this.determineConversationPhase(session),
        momentum: "maintaining",
        confusion_indicators: [],
        engagement_level: "medium",
      },
    };

    return this.followUpGenerator.generateContextualHints(hintRequest);
  }

  private generateProgressionSuggestions(
    session: ConversationalSession,
    userProfile: UserLearningProfile,
    context: EnhancedQueryContext,
  ): ProgressionSuggestion[] {
    const conversationHistory = session.getHistory();
    return this.progressionEngine.generateProgressionSuggestions(
      userProfile,
      conversationHistory,
      context,
    );
  }

  private extractLearningInsights(
    session: ConversationalSession,
    turn: ConversationTurn,
    userProfile: UserLearningProfile,
  ): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Analyze skill progress
    if (turn.learningPoints.length > 0) {
      insights.push({
        type: "skill_progress",
        insight: `You've demonstrated understanding of ${turn.learningPoints.length} new concepts`,
        confidence: 0.8,
        actionable: true,
        relatedConcepts: turn.learningPoints.map((lp) => lp.concept),
        timeframe: "immediate",
      });
    }

    // Identify knowledge gaps
    const mentionedConcepts = this.extractMentionedConcepts(
      turn.userMessage.content,
    );
    const unknownConcepts = mentionedConcepts.filter(
      (concept) => !userProfile.knownConcepts.includes(concept),
    );

    if (unknownConcepts.length > 0) {
      insights.push({
        type: "knowledge_gap",
        insight: `Learning opportunity identified in: ${unknownConcepts.join(", ")}`,
        confidence: 0.7,
        actionable: true,
        relatedConcepts: unknownConcepts,
        timeframe: "short_term",
      });
    }

    return insights;
  }

  private generateNextSteps(
    turn: ConversationTurn,
    followUpQuestions: FollowUpQuestion[],
    progressionSuggestions: ProgressionSuggestion[],
  ): string[] {
    const steps: string[] = [];

    // Add steps based on follow-up questions
    const highPriorityQuestions = followUpQuestions.filter(
      (q) => q.priority === "high" || q.priority === "critical",
    );
    if (highPriorityQuestions.length > 0) {
      steps.push(`Consider: ${highPriorityQuestions[0].question}`);
    }

    // Add steps based on progression suggestions
    const topSuggestion = progressionSuggestions.find(
      (s) => s.priority === "high" || s.priority === "critical",
    );
    if (topSuggestion) {
      steps.push(topSuggestion.title);
    }

    // Add general next steps
    if (turn.nextSuggestions.length > 0) {
      steps.push(...turn.nextSuggestions.slice(0, 2));
    }

    return steps.slice(0, 5); // Limit to 5 steps
  }

  private shouldSummarizeSession(session: ConversationalSession): boolean {
    const timeSinceStart = Date.now() - session.start.getTime();
    const thirtyMinutes = 30 * 60 * 1000;

    return session.messageCount > 20 || timeSinceStart > thirtyMinutes;
  }

  private generateWelcomeMessage(
    userProfile: UserLearningProfile,
    suggestedPath: LearningPath,
  ): string {
    return `Welcome! I see you're at a ${userProfile.experienceLevel} level with Redis. I've created a personalized learning path "${suggestedPath.name}" to help you achieve your goals: ${userProfile.learningGoals.join(", ")}. Let's start exploring!`;
  }

  private generateInitialQuestions(
    userProfile: UserLearningProfile,
    goals: string[],
  ): FollowUpQuestion[] {
    // Generate starter questions based on profile and goals
    return [
      {
        id: "initial-1",
        question: `What specific Redis use case are you most interested in exploring first?`,
        category: "clarification",
        priority: "high",
        context: {
          triggeredBy: "session_start",
          relatedConcepts: goals,
          prerequisiteKnowledge: [],
          difficultyLevel: userProfile.experienceLevel as any,
          timeToAsk: "immediate",
        },
        expectedResponse: "User describes their primary interest",
        learningObjective: "Understand user priorities",
      },
    ];
  }

  private generateSessionId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractCommandsFromMessage(message: string): string[] {
    const commands = ["GET", "SET", "HGET", "HSET", "LPUSH", "SADD", "ZADD"];
    return commands.filter((cmd) => message.toUpperCase().includes(cmd));
  }

  private extractPatternsFromMessage(message: string): string[] {
    const patterns = ["caching", "session", "leaderboard", "queue", "pub_sub"];
    return patterns.filter((pattern) =>
      message.toLowerCase().includes(pattern),
    );
  }

  private extractDemonstratedConcepts(
    session: ConversationalSession,
  ): string[] {
    const concepts = new Set<string>();
    const history = session.getHistory();

    history.forEach((msg) => {
      if (msg.metadata?.commandsUsed) {
        msg.metadata.commandsUsed.forEach((cmd: string) => concepts.add(cmd));
      }
    });

    return Array.from(concepts);
  }

  private assessCurrentExperienceLevel(
    profile: UserLearningProfile,
    session: ConversationalSession | null,
  ): string {
    if (!session) return profile.experienceLevel;

    const conceptCount = profile.knownConcepts.length;

    if (conceptCount > 15) return "expert";
    if (conceptCount > 8) return "advanced";
    if (conceptCount > 4) return "intermediate";
    return "beginner";
  }

  private determineConversationPhase(
    session: ConversationalSession,
  ): "introduction" | "exploration" | "deep_dive" | "application" | "wrap_up" {
    const messageCount = session.messageCount;

    if (messageCount < 3) return "introduction";
    if (messageCount < 8) return "exploration";
    if (messageCount < 15) return "deep_dive";
    if (messageCount < 25) return "application";
    return "wrap_up";
  }

  private extractMentionedConcepts(message: string): string[] {
    const concepts = [
      "redis",
      "cache",
      "session",
      "hash",
      "list",
      "set",
      "sorted set",
      "stream",
    ];
    return concepts.filter((concept) =>
      message.toLowerCase().includes(concept),
    );
  }

  private analyzeConversationEffectiveness(
    session: ConversationalSession,
    profile: UserLearningProfile,
  ): EffectivenessAnalysis {
    const progression = session.getLearningProgression();

    return {
      learningEffectiveness:
        progression.conceptsLearned.length / Math.max(1, session.turnCount),
      engagementScore: session.messageCount > 10 ? 0.8 : 0.6,
      goalAlignment: profile.learningGoals.length > 0 ? 0.9 : 0.5,
      overallScore: 0.75,
    };
  }

  private generateImprovementRecommendations(
    session: ConversationalSession,
    effectiveness: EffectivenessAnalysis,
  ): string[] {
    const recommendations: string[] = [];

    if (effectiveness.learningEffectiveness < 0.5) {
      recommendations.push("Focus on smaller, more digestible learning chunks");
    }

    if (effectiveness.engagementScore < 0.7) {
      recommendations.push(
        "Incorporate more interactive exercises and examples",
      );
    }

    if (effectiveness.goalAlignment < 0.8) {
      recommendations.push(
        "Regularly check alignment with stated learning goals",
      );
    }

    return recommendations;
  }
}

// Additional interfaces
interface SessionReport {
  sessionId: string;
  conversationSummary: ConversationSummary;
  learningProgression: LearningProgression;
  effectivenessAnalysis: EffectivenessAnalysis;
  improvementRecommendations: string[];
  generatedAt: Date;
}

interface EffectivenessAnalysis {
  learningEffectiveness: number;
  engagementScore: number;
  goalAlignment: number;
  overallScore: number;
}

// Export all components
export {
  ConversationalSession,
  FollowUpQuestionGenerator,
  ProgressionSuggestionEngine,
  type ConversationMessage,
  type FollowUpQuestion,
  type ContextualHint,
  type ProgressionSuggestion,
  type LearningPath,
  type UserLearningProfile,
};

export default ConversationalInterface;

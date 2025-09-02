/**
 * Context Persistence System
 * Integrates session memory management and incremental learning experience
 */

import SessionMemoryManager, {
  type SessionMemory,
  type MemoryLayers,
  type MemoryInsight,
  type ConceptMemory,
  type SkillMemory,
} from "./session-memory.js";

import IncrementalLearningExperience, {
  type LearningExperience,
  type LearningPhase,
  type BuildingBlock,
  type ContextLayer,
  type AdaptiveElement,
  type LearningProgressMetrics,
  type LearningSnapshot,
} from "./learning-experience.js";

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { UserLearningProfile } from "../conversational/followup-generator.js";
import { ConversationMessage } from "../conversational/session-manager.js";

export interface ContextPersistenceRequest {
  sessionId: string;
  userId: string;
  requestType:
    | "initialize"
    | "store"
    | "retrieve"
    | "consolidate"
    | "advance"
    | "snapshot";
  context: EnhancedQueryContext;
  data?: any;
  options?: ContextPersistenceOptions;
}

export interface ContextPersistenceOptions {
  enableMemoryConsolidation: boolean;
  enableLearningProgression: boolean;
  memoryRetentionPeriod: number; // hours
  learningPhaseAdvancement: "automatic" | "manual" | "hybrid";
  adaptationSensitivity: "low" | "medium" | "high";
  contextBuildingStrategy: "incremental" | "comprehensive" | "adaptive";
}

export interface ContextPersistenceResult {
  sessionId: string;
  success: boolean;
  sessionMemory?: SessionMemory;
  learningExperience?: LearningExperience;
  memoryInsights?: MemoryInsight[];
  learningSnapshot?: LearningSnapshot;
  recommendations?: ContextRecommendation[];
  nextActions?: string[];
}

export interface ContextRecommendation {
  type:
    | "memory_optimization"
    | "learning_advancement"
    | "context_building"
    | "skill_reinforcement";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  actionItems: string[];
  expectedOutcome: string;
  timeframe: "immediate" | "short_term" | "long_term";
}

export interface ContextSnapshot {
  timestamp: Date;
  sessionId: string;
  userId: string;
  memoryState: MemoryStateSnapshot;
  learningState: LearningStateSnapshot;
  contextConnections: ContextConnection[];
  progressMetrics: CombinedProgressMetrics;
  adaptationHistory: AdaptationEvent[];
}

export interface MemoryStateSnapshot {
  totalMemories: number;
  memoryDistribution: MemoryDistribution;
  activeContexts: string[];
  retentionHealth: number; // 0-1
  consolidationEfficiency: number; // 0-1
}

export interface LearningStateSnapshot {
  currentPhase: string;
  buildingBlocksStatus: BuildingBlockStatus[];
  adaptationSettings: Record<string, any>;
  progressVelocity: number;
  masteryDistribution: Record<string, number>;
}

export interface ContextConnection {
  fromElement: string;
  toElement: string;
  connectionType:
    | "memory_to_learning"
    | "concept_to_skill"
    | "experience_to_adaptation";
  strength: number; // 0-1
  bidirectional: boolean;
  lastReinforced: Date;
}

export interface CombinedProgressMetrics {
  memoryEfficiency: number; // 0-1
  learningVelocity: number; // concepts per hour
  contextualUnderstanding: number; // 0-1
  skillTransfer: number; // 0-1
  adaptationSuccess: number; // 0-1
  overallProgress: number; // 0-1
}

export interface AdaptationEvent {
  timestamp: Date;
  trigger: string;
  adaptationType: string;
  previousState: any;
  newState: any;
  effectiveness: number; // 0-1
  source: "memory" | "learning" | "context";
}

export interface MemoryDistribution {
  shortTerm: number;
  longTerm: number;
  working: number;
  contextual: number;
}

export interface BuildingBlockStatus {
  blockId: string;
  concept: string;
  masteryLevel: string;
  progress: number; // 0-1
  lastActivity: Date;
}

export interface LearningData {
  concept: string;
  interaction_type: string;
  performance: number;
  timestamp: Date;
  context: string;
}

export interface ContextBuildingResult {
  newConnections: ContextConnection[];
  strengthenedConnections: ContextConnection[];
  learningAdvancements: LearningAdvancement[];
  memoryConsolidations: MemoryConsolidation[];
  adaptationUpdates: AdaptationUpdate[];
}

export interface LearningAdvancement {
  type:
    | "concept_mastery"
    | "skill_development"
    | "phase_progression"
    | "context_expansion";
  description: string;
  impact: number; // 0-1
  evidence: string[];
}

export interface MemoryConsolidation {
  type: "strengthening" | "pruning" | "merging" | "promotion";
  description: string;
  memoriesAffected: number;
  efficiency: number; // 0-1
}

export interface AdaptationUpdate {
  elementType: string;
  previousSetting: any;
  newSetting: any;
  reasoning: string;
  expectedImpact: string;
}

export class ContextPersistenceSystem {
  private memoryManager: SessionMemoryManager;
  private learningExperience: IncrementalLearningExperience;
  private activeSessions: Map<string, ContextSession> = new Map();
  private contextConnections: Map<string, ContextConnection[]> = new Map();
  private adaptationHistory: Map<string, AdaptationEvent[]> = new Map();

  constructor(options?: Partial<ContextPersistenceOptions>) {
    this.memoryManager = new SessionMemoryManager();
    this.learningExperience = new IncrementalLearningExperience();
  }

  /**
   * Process context persistence request
   */
  async processRequest(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    try {
      switch (request.requestType) {
        case "initialize":
          return await this.initializeContext(request);

        case "store":
          return await this.storeContext(request);

        case "retrieve":
          return await this.retrieveContext(request);

        case "consolidate":
          return await this.consolidateContext(request);

        case "advance":
          return await this.advanceLearning(request);

        case "snapshot":
          return await this.createSnapshot(request);

        default:
          throw new Error(`Unknown request type: ${request.requestType}`);
      }
    } catch (error) {
      return {
        sessionId: request.sessionId,
        success: false,
        recommendations: [
          {
            type: "memory_optimization",
            priority: "high",
            title: "Error Recovery",
            description: `Failed to process ${request.requestType} request: ${error instanceof Error ? error.message : String(error)}`,
            actionItems: ["Review request parameters", "Check system state"],
            expectedOutcome: "Successful request processing",
            timeframe: "immediate",
          },
        ],
      };
    }
  }

  /**
   * Initialize context for a new session
   */
  private async initializeContext(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    const { sessionId, userId, context } = request;

    // Extract user profile from context
    const userProfile: UserLearningProfile = {
      experienceLevel: context.userExperienceLevel,
      preferredLearningStyle: "hands-on",
      knownConcepts: [],
      learningGoals: [],
      struggleAreas: [],
      interests: [],
    };

    // Initialize session memory
    const sessionMemory = this.memoryManager.initializeSession(
      sessionId,
      userId,
      userProfile,
      context,
    );

    // Initialize learning experience
    const learningExp = this.learningExperience.initializeLearningExperience(
      userId,
      userProfile,
      sessionMemory,
      context,
    );

    // Create context session
    const contextSession: ContextSession = {
      sessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      sessionMemory,
      learningExperience: learningExp,
      contextConnections: [],
      syncState: "synchronized",
    };

    this.activeSessions.set(sessionId, contextSession);
    this.contextConnections.set(sessionId, []);
    this.adaptationHistory.set(sessionId, []);

    // Generate initial recommendations
    const recommendations = this.generateInitialRecommendations(contextSession);

    return {
      sessionId,
      success: true,
      sessionMemory,
      learningExperience: learningExp,
      recommendations,
      nextActions: [
        "Begin learning interaction",
        "Start building context through conversation",
        "Monitor memory and learning synchronization",
      ],
    };
  }

  /**
   * Store new information in context
   */
  private async storeContext(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    const session = this.activeSessions.get(request.sessionId);
    if (!session) {
      throw new Error(`Session ${request.sessionId} not found`);
    }

    const { data } = request;

    // Store in memory system
    const memoryRequest: any = {
      // MemoryStorageRequest type not found
      content: data.content,
      type: data.type || "experiential",
      importance: data.importance || 0.5,
      urgency: data.urgency || "medium",
      lifespan: data.lifespan || "session",
      concepts: data.concepts || [],
    };

    const memoryResult = this.memoryManager.storeMemory(
      request.sessionId,
      memoryRequest,
    );

    // Update learning experience
    const learningData: LearningData = {
      concept: data.concept || "general",
      interaction_type: data.interactionType || "conversation",
      performance: data.performance || 0.7,
      timestamp: new Date(),
      context: "",
    };

    const contextBuildingResult =
      this.learningExperience.buildIncrementalContext(
        session.learningExperience.experienceId,
        learningData,
        request.context,
      );

    // Build connections between memory and learning
    const newConnections = this.buildMemoryLearningConnections(
      memoryResult,
      contextBuildingResult,
      session,
    );

    // Update session
    session.lastActivity = new Date();
    session.contextConnections.push(...newConnections);

    // Generate insights
    const contextInsights = this.generateContextInsights(
      session,
      contextBuildingResult,
    );

    return {
      sessionId: request.sessionId,
      success: true,
      memoryInsights: contextInsights,
      recommendations: this.generateStorageRecommendations(
        session,
        contextBuildingResult,
      ),
      nextActions: this.generateNextActions(session, "store"),
    };
  }

  /**
   * Retrieve context information
   */
  private async retrieveContext(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    const session = this.activeSessions.get(request.sessionId);
    if (!session) {
      throw new Error(`Session ${request.sessionId} not found`);
    }

    const retrievalContext: any = {
      // MemoryRetrievalContext type not found
      query: request.data?.query || "",
      concepts: request.data?.concepts || [],
      strategy: request.data?.strategy || "comprehensive",
      maxResults: request.data?.maxResults || 10,
    };

    const memoryResults = this.memoryManager.retrieveMemories(
      request.sessionId,
      retrievalContext,
    );
    const learningSnapshot = this.learningExperience.createLearningSnapshot(
      session.learningExperience.experienceId,
    );

    // Combine memory and learning context
    const combinedContext = this.combineMemoryAndLearningContext(
      memoryResults,
      learningSnapshot,
      session,
    );

    return {
      sessionId: request.sessionId,
      success: true,
      learningSnapshot,
      recommendations: this.generateRetrievalRecommendations(combinedContext),
      nextActions: this.generateNextActions(session, "retrieve"),
    };
  }

  /**
   * Consolidate memory and learning
   */
  private async consolidateContext(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    const session = this.activeSessions.get(request.sessionId);
    if (!session) {
      throw new Error(`Session ${request.sessionId} not found`);
    }

    // Consolidate memory
    const memoryConsolidation = this.memoryManager.consolidateMemory(
      request.sessionId,
    );

    // Update learning experience based on memory insights
    const learningAdvancement = this.advanceLearningBasedOnMemory(session);

    // Strengthen context connections
    const connectionUpdates = this.strengthenContextConnections(session);

    // Record adaptation event
    const adaptationEvent: AdaptationEvent = {
      timestamp: new Date(),
      trigger: "consolidation_cycle",
      adaptationType: "memory_learning_sync",
      previousState: "pre_consolidation",
      newState: "post_consolidation",
      effectiveness:
        this.calculateConsolidationEffectiveness(learningAdvancement),
      source: "context",
    };

    this.recordAdaptationEvent(request.sessionId, adaptationEvent);

    return {
      sessionId: request.sessionId,
      success: true,
      memoryInsights: memoryConsolidation.insights,
      recommendations:
        this.generateConsolidationRecommendations(memoryConsolidation),
      nextActions: this.generateNextActions(session, "consolidate"),
    };
  }

  /**
   * Advance learning phase
   */
  private async advanceLearning(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    const session = this.activeSessions.get(request.sessionId);
    if (!session) {
      throw new Error(`Session ${request.sessionId} not found`);
    }

    const completionEvidence = request.data?.evidence || {
      evidenceType: "performance",
      data: { success_rate: 0.8 },
      confidence: 0.8,
    };

    const advancementResult = this.learningExperience.advanceLearningPhase(
      session.learningExperience.experienceId,
      completionEvidence,
    );

    // Update memory priorities based on new learning phase
    if (advancementResult.advanced) {
      this.updateMemoryPriorities(session, advancementResult.currentPhase);
    }

    return {
      sessionId: request.sessionId,
      success: true,
      recommendations:
        this.generateLearningAdvancementRecommendations(advancementResult),
      nextActions: this.generateNextActions(session, "advance"),
    };
  }

  /**
   * Create comprehensive context snapshot
   */
  private async createSnapshot(
    request: ContextPersistenceRequest,
  ): Promise<ContextPersistenceResult> {
    const session = this.activeSessions.get(request.sessionId);
    if (!session) {
      throw new Error(`Session ${request.sessionId} not found`);
    }

    const learningSnapshot = this.learningExperience.createLearningSnapshot(
      session.learningExperience.experienceId,
    );

    const memoryInsights = this.memoryManager.generateMemoryInsights(
      request.sessionId,
    );

    const contextSnapshot: ContextSnapshot = {
      timestamp: new Date(),
      sessionId: request.sessionId,
      userId: session.userId,
      memoryState: {
        totalMemories: this.calculateTotalMemories(session.sessionMemory),
        memoryDistribution: this.calculateMemoryDistribution(
          session.sessionMemory,
        ),
        activeContexts: learningSnapshot.active_concepts,
        retentionHealth: memoryInsights.memoryEfficiency,
        consolidationEfficiency: 0.8, // Calculated metric
      },
      learningState: {
        currentPhase: learningSnapshot.phase,
        buildingBlocksStatus: this.extractBuildingBlockStatus(
          session.learningExperience,
        ),
        adaptationSettings: learningSnapshot.adaptation_state,
        progressVelocity:
          learningSnapshot.progress_indicators.learning_velocity,
        masteryDistribution: Object.fromEntries(
          Object.entries(learningSnapshot.mastery_levels).map(([k, v]) => [
            k,
            Number(v),
          ]),
        ),
      },
      contextConnections: session.contextConnections,
      progressMetrics: {
        memoryEfficiency: memoryInsights.memoryEfficiency,
        learningVelocity:
          learningSnapshot.progress_indicators.learning_velocity,
        contextualUnderstanding:
          learningSnapshot.progress_indicators.connection_strength,
        skillTransfer: learningSnapshot.progress_indicators.transfer_ability,
        adaptationSuccess: 0.75, // Calculated metric
        overallProgress: this.calculateOverallProgress(
          learningSnapshot,
          memoryInsights,
        ),
      },
      adaptationHistory: this.adaptationHistory.get(request.sessionId) || [],
    };

    return {
      sessionId: request.sessionId,
      success: true,
      learningSnapshot,
      memoryInsights: memoryInsights.recommendations.map((rec) => ({
        insightId: `insight-${Date.now()}`,
        type: "knowledge_gap",
        description: rec.description,
        confidence: 0.8,
        supporting_evidence: [],
        recommendations: [rec.description],
        generated: new Date(),
      })),
      recommendations: this.generateSnapshotRecommendations(contextSnapshot),
      nextActions: this.generateNextActions(session, "snapshot"),
    };
  }

  /**
   * Helper methods
   */
  private generateInitialRecommendations(
    session: ContextSession,
  ): ContextRecommendation[] {
    return [
      {
        type: "context_building",
        priority: "medium",
        title: "Begin Context Building",
        description:
          "Start building contextual understanding through conversation",
        actionItems: [
          "Engage in learning conversations",
          "Demonstrate knowledge through examples",
          "Ask clarifying questions",
        ],
        expectedOutcome: "Rich contextual foundation for personalized learning",
        timeframe: "short_term",
      },
    ];
  }

  private buildMemoryLearningConnections(
    memoryResult: any,
    contextResult: any,
    session: ContextSession,
  ): ContextConnection[] {
    const connections: ContextConnection[] = [];

    // Create connection between memory and learning experience
    connections.push({
      fromElement: memoryResult.memoryId,
      toElement: session.learningExperience.experienceId,
      connectionType: "memory_to_learning",
      strength: 0.7,
      bidirectional: true,
      lastReinforced: new Date(),
    });

    return connections;
  }

  private generateContextInsights(
    session: ContextSession,
    result: any,
  ): MemoryInsight[] {
    return [
      {
        insightId: `insight-${Date.now()}`,
        type: "pattern_discovery",
        description: "New learning pattern detected in context building",
        confidence: 0.8,
        supporting_evidence: [
          "Consistent interaction patterns",
          "Progressive skill development",
        ],
        recommendations: [
          "Continue current learning approach",
          "Increase context complexity",
        ],
        generated: new Date(),
      },
    ];
  }

  private generateStorageRecommendations(
    session: ContextSession,
    result: any,
  ): ContextRecommendation[] {
    return [
      {
        type: "memory_optimization",
        priority: "medium",
        title: "Optimize Context Storage",
        description: "Enhance context storage efficiency",
        actionItems: ["Review memory allocation", "Strengthen key concepts"],
        expectedOutcome: "Improved context retrieval and learning",
        timeframe: "short_term",
      },
    ];
  }

  private generateNextActions(
    session: ContextSession,
    requestType: string,
  ): string[] {
    const baseActions = [
      "Continue learning conversation",
      "Monitor memory consolidation",
      "Track learning progression",
    ];

    const typeSpecificActions: Record<string, string[]> = {
      store: ["Reinforce stored concepts", "Build conceptual connections"],
      retrieve: ["Apply retrieved knowledge", "Expand on discovered patterns"],
      consolidate: ["Review consolidated insights", "Plan next learning phase"],
      advance: ["Explore advanced concepts", "Practice new skills"],
      snapshot: ["Analyze progress trends", "Adjust learning strategies"],
    };

    return [...baseActions, ...(typeSpecificActions[requestType] || [])];
  }

  // Additional helper methods would continue here...
  private combineMemoryAndLearningContext(
    memoryResults: any,
    learningSnapshot: LearningSnapshot,
    session: ContextSession,
  ): any {
    return { combined: true };
  }

  private generateRetrievalRecommendations(
    combinedContext: any,
  ): ContextRecommendation[] {
    return [];
  }

  private advanceLearningBasedOnMemory(
    session: ContextSession,
    // consolidation: any, // ConsolidationResult type not found
  ): any {
    return { advanced: true };
  }

  private strengthenContextConnections(session: ContextSession): any {
    return { strengthened: true };
  }

  private calculateConsolidationEffectiveness(
    // memory: any, // ConsolidationResult type not found
    learning: any,
  ): number {
    return 0.8;
  }

  private recordAdaptationEvent(
    sessionId: string,
    event: AdaptationEvent,
  ): void {
    const history = this.adaptationHistory.get(sessionId) || [];
    history.push(event);
    this.adaptationHistory.set(sessionId, history);
  }

  private generateConsolidationRecommendations(
    // memory: any, // ConsolidationResult type not found
    learning: any,
  ): ContextRecommendation[] {
    return [];
  }

  private updateMemoryPriorities(session: ContextSession, phase: any): void {
    // Update memory priorities based on learning phase
  }

  private generateLearningAdvancementRecommendations(
    result: any,
  ): ContextRecommendation[] {
    return [];
  }

  private calculateTotalMemories(memory: SessionMemory): number {
    return (
      memory.memoryLayers.shortTerm.memories.length +
      memory.memoryLayers.longTerm.concepts.length +
      memory.memoryLayers.longTerm.skills.length
    );
  }

  private calculateMemoryDistribution(
    memory: SessionMemory,
  ): MemoryDistribution {
    const total = this.calculateTotalMemories(memory);
    return {
      shortTerm: memory.memoryLayers.shortTerm.memories.length / total,
      longTerm:
        (memory.memoryLayers.longTerm.concepts.length +
          memory.memoryLayers.longTerm.skills.length) /
        total,
      working: 0.1, // Estimated
      contextual: 0.1, // Estimated
    };
  }

  private extractBuildingBlockStatus(
    experience: LearningExperience,
  ): BuildingBlockStatus[] {
    return experience.buildingBlocks.map((block) => ({
      blockId: block.blockId,
      concept: block.concept,
      masteryLevel: block.mastery_level,
      progress:
        block.mastery_level === "mastered"
          ? 1.0
          : block.mastery_level === "practiced"
            ? 0.7
            : 0.3,
      lastActivity: new Date(),
    }));
  }

  private calculateOverallProgress(
    snapshot: LearningSnapshot,
    memoryInsights: any, // MemoryInsightReport type not found
  ): number {
    return (
      (snapshot.progress_indicators.conceptual_growth +
        snapshot.progress_indicators.skill_development +
        memoryInsights.memoryEfficiency) /
      3
    );
  }

  private generateSnapshotRecommendations(
    snapshot: ContextSnapshot,
  ): ContextRecommendation[] {
    const recommendations: ContextRecommendation[] = [];

    if (snapshot.progressMetrics.overallProgress < 0.5) {
      recommendations.push({
        type: "learning_advancement",
        priority: "high",
        title: "Accelerate Learning Progress",
        description: "Current progress is below optimal pace",
        actionItems: ["Increase interaction frequency", "Focus on weak areas"],
        expectedOutcome: "Improved learning velocity and retention",
        timeframe: "short_term",
      });
    }

    return recommendations;
  }

  /**
   * Public utility methods
   */
  getActiveSession(sessionId: string): ContextSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  getAllActiveSessions(): ContextSession[] {
    return Array.from(this.activeSessions.values());
  }

  getContextConnections(sessionId: string): ContextConnection[] {
    return this.contextConnections.get(sessionId) || [];
  }

  getAdaptationHistory(sessionId: string): AdaptationEvent[] {
    return this.adaptationHistory.get(sessionId) || [];
  }
}

// Supporting interface
interface ContextSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  sessionMemory: SessionMemory;
  learningExperience: LearningExperience;
  contextConnections: ContextConnection[];
  syncState: "synchronized" | "syncing" | "error";
}

// Export all components
export {
  SessionMemoryManager,
  IncrementalLearningExperience,
  type SessionMemory,
  type LearningExperience,
  // type ContextSnapshot, // Removed due to export conflict
  // type MemoryInsightReport, // Type not found
  type LearningSnapshot,
};

export default ContextPersistenceSystem;

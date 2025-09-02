/**
 * Progression Suggestions for Learning Workflows
 * Provides intelligent learning path recommendations and skill progression tracking
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { ConversationMessage, LearningPoint } from "./session-manager.js";
import { UserLearningProfile } from "./followup-generator.js";

export interface LearningPath {
  pathId: string;
  name: string;
  description: string;
  targetAudience: string[];
  estimatedDuration: string;
  milestones: LearningMilestone[];
  progressTracking: ProgressMetrics;
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: string;
  learningObjectives: string[];
  practicalExercises: PracticalExercise[];
  prerequisites: string[];
  nextSteps: string[];
}

export interface PracticalExercise {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedTime: string;
  instructions: string[];
  expectedOutcome: string;
  hints: string[];
}

export interface ProgressMetrics {
  completionPercentage: number;
  milestonesCompleted: number;
  totalMilestones: number;
  skillsAcquired: string[];
  timeSpent: number;
  strengthAreas: string[];
  improvementAreas: string[];
  nextRecommendations: string[];
}

export interface ProgressionSuggestion {
  id: string;
  type:
    | "next_concept"
    | "skill_reinforcement"
    | "practical_application"
    | "advanced_topic"
    | "review";
  title: string;
  description: string;
  reasoning: string;
  priority: "low" | "medium" | "high" | "critical";
  estimatedBenefit: string;
  prerequisites: string[];
  resources: LearningResource[];
  estimatedTime: string;
}

export interface LearningResource {
  type: "tutorial" | "documentation" | "example" | "exercise" | "project";
  title: string;
  description: string;
  difficulty: string;
  format: "text" | "code" | "interactive";
  content?: string;
}

export interface SkillAssessment {
  assessmentId: string;
  timestamp: Date;
  skillAreas: SkillEvaluation[];
  overallLevel: string;
  recommendations: string[];
  strengthsIdentified: string[];
  areasForImprovement: string[];
  nextLearningGoals: string[];
}

export interface SkillEvaluation {
  skill: string;
  currentLevel: "novice" | "beginner" | "intermediate" | "advanced" | "expert";
  confidence: number; // 0-1
  evidencePoints: string[];
  improvementSuggestions: string[];
}

export class ProgressionSuggestionEngine {
  private learningPaths: Map<string, LearningPath> = new Map();
  private skillGraph: Map<string, SkillNode> = new Map();

  constructor() {
    this.initializeLearningPaths();
    this.initializeSkillGraph();
  }

  /**
   * Generate personalized progression suggestions
   */
  generateProgressionSuggestions(
    learningProfile: UserLearningProfile,
    conversationHistory: ConversationMessage[],
    currentContext: EnhancedQueryContext,
  ): ProgressionSuggestion[] {
    const suggestions: ProgressionSuggestion[] = [];

    // Analyze current skill level
    const skillAssessment = this.assessCurrentSkills(
      learningProfile,
      conversationHistory,
    );

    // Identify next learning opportunities
    const nextConcepts = this.identifyNextConcepts(
      skillAssessment,
      learningProfile,
    );

    // Generate concept-specific suggestions
    nextConcepts.forEach((concept) => {
      const conceptSuggestions = this.generateConceptSuggestions(
        concept,
        skillAssessment,
        learningProfile,
      );
      suggestions.push(...conceptSuggestions);
    });

    // Add skill reinforcement suggestions
    const reinforcementSuggestions = this.generateReinforcementSuggestions(
      skillAssessment,
      conversationHistory,
    );
    suggestions.push(...reinforcementSuggestions);

    // Add practical application suggestions
    const applicationSuggestions = this.generateApplicationSuggestions(
      skillAssessment,
      learningProfile,
    );
    suggestions.push(...applicationSuggestions);

    return this.rankSuggestions(suggestions, learningProfile).slice(0, 10);
  }

  /**
   * Create personalized learning path
   */
  createPersonalizedPath(
    profile: UserLearningProfile,
    goals: string[],
    timeConstraints: string,
  ): LearningPath {
    const pathId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const basePath = this.selectBasePath(profile, goals);
    const customMilestones = this.customizeMilestones(
      basePath.milestones,
      profile,
      goals,
    );
    const progressTracking = this.initializeProgressTracking(customMilestones);

    return {
      pathId,
      name: `Personalized Redis Learning Path for ${profile.experienceLevel}`,
      description: `Custom learning path tailored to your goals: ${goals.join(", ")}`,
      targetAudience: [profile.experienceLevel],
      estimatedDuration: this.calculateEstimatedDuration(customMilestones),
      milestones: customMilestones,
      progressTracking,
    };
  }

  /**
   * Track learning progress and update recommendations
   */
  updateLearningProgress(
    pathId: string,
    milestoneId: string,
    completedExercises: string[],
  ): {
    updatedProgress: ProgressMetrics;
    nextSuggestions: ProgressionSuggestion[];
    achievements: Achievement[];
  } {
    const path = this.learningPaths.get(pathId);
    if (!path) throw new Error(`Learning path ${pathId} not found`);

    const milestone = path.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

    const updatedProgress = this.calculateUpdatedProgress(
      path,
      milestoneId,
      completedExercises,
    );
    const nextSuggestions = this.generateNextMilestoneSuggestions(
      path,
      milestone,
      updatedProgress,
    );
    const achievements = this.checkAchievements(path, updatedProgress);

    return { updatedProgress, nextSuggestions, achievements };
  }

  /**
   * Initialize learning paths
   */
  private initializeLearningPaths(): void {
    // Beginner path
    this.learningPaths.set("beginner", {
      pathId: "beginner",
      name: "Redis Fundamentals",
      description: "Complete introduction to Redis for beginners",
      targetAudience: ["beginner"],
      estimatedDuration: "2-3 weeks",
      milestones: [
        {
          id: "redis-basics",
          title: "Redis Basics",
          description: "Understanding Redis data types and basic operations",
          order: 1,
          estimatedTime: "3-5 hours",
          learningObjectives: [
            "Understand what Redis is and its use cases",
            "Learn basic data types: strings, lists, sets",
            "Master basic commands: GET, SET, LPUSH, SADD",
          ],
          practicalExercises: [
            {
              id: "basic-operations",
              title: "Basic Redis Operations",
              description:
                "Practice basic GET/SET operations with different data types",
              difficulty: "beginner",
              estimatedTime: "30 minutes",
              instructions: [
                "Connect to Redis using GLIDE client",
                "Store and retrieve string values",
                "Work with lists using LPUSH and LRANGE",
                "Experiment with sets using SADD and SMEMBERS",
              ],
              expectedOutcome:
                "Successfully perform basic operations on different data types",
              hints: [
                "Remember that Redis keys are case-sensitive",
                "Use descriptive key names for better organization",
              ],
            },
          ],
          prerequisites: [],
          nextSteps: ["hashes-and-sorted-sets"],
        },
        {
          id: "hashes-and-sorted-sets",
          title: "Hashes and Sorted Sets",
          description: "Working with complex data structures",
          order: 2,
          estimatedTime: "4-6 hours",
          learningObjectives: [
            "Master hash operations: HSET, HGET, HGETALL",
            "Understand sorted sets: ZADD, ZRANGE, ZRANK",
            "Learn when to use each data structure",
          ],
          practicalExercises: [
            {
              id: "user-profiles",
              title: "User Profile Storage",
              description: "Build a user profile system using Redis hashes",
              difficulty: "beginner",
              estimatedTime: "45 minutes",
              instructions: [
                "Create user profiles using HSET",
                "Retrieve user data with HGET and HGETALL",
                "Update profile fields",
                "Handle missing users gracefully",
              ],
              expectedOutcome: "Working user profile storage system",
              hints: [
                "Use consistent key naming like user:123",
                "Consider which fields need atomic updates",
              ],
            },
          ],
          prerequisites: ["redis-basics"],
          nextSteps: ["caching-patterns"],
        },
      ],
      progressTracking: {
        completionPercentage: 0,
        milestonesCompleted: 0,
        totalMilestones: 2,
        skillsAcquired: [],
        timeSpent: 0,
        strengthAreas: [],
        improvementAreas: [],
        nextRecommendations: [],
      },
    });

    // Intermediate path
    this.learningPaths.set("intermediate", {
      pathId: "intermediate",
      name: "Redis Patterns and Best Practices",
      description: "Learn common Redis patterns and production best practices",
      targetAudience: ["intermediate"],
      estimatedDuration: "3-4 weeks",
      milestones: [
        {
          id: "caching-patterns",
          title: "Caching Patterns",
          description:
            "Master cache-aside, write-through, and write-behind patterns",
          order: 1,
          estimatedTime: "6-8 hours",
          learningObjectives: [
            "Implement cache-aside pattern",
            "Understand cache invalidation strategies",
            "Learn about cache warming and preloading",
          ],
          practicalExercises: [
            {
              id: "cache-layer",
              title: "Build a Caching Layer",
              description: "Implement a production-ready caching layer",
              difficulty: "intermediate",
              estimatedTime: "2 hours",
              instructions: [
                "Implement cache-aside pattern",
                "Add TTL-based expiration",
                "Handle cache misses gracefully",
                "Implement bulk operations",
              ],
              expectedOutcome:
                "Production-ready caching layer with proper error handling",
              hints: [
                "Consider serialization strategies",
                "Plan for cache warming scenarios",
              ],
            },
          ],
          prerequisites: ["hashes-and-sorted-sets"],
          nextSteps: ["pub-sub-patterns"],
        },
      ],
      progressTracking: {
        completionPercentage: 0,
        milestonesCompleted: 0,
        totalMilestones: 1,
        skillsAcquired: [],
        timeSpent: 0,
        strengthAreas: [],
        improvementAreas: [],
        nextRecommendations: [],
      },
    });
  }

  /**
   * Initialize skill graph for prerequisite tracking
   */
  private initializeSkillGraph(): void {
    const skills: SkillNode[] = [
      {
        id: "basic_redis",
        name: "Basic Redis",
        prerequisites: [],
        dependents: ["hash_operations", "list_operations"],
      },
      {
        id: "hash_operations",
        name: "Hash Operations",
        prerequisites: ["basic_redis"],
        dependents: ["user_management"],
      },
      {
        id: "caching_patterns",
        name: "Caching Patterns",
        prerequisites: ["basic_redis", "hash_operations"],
        dependents: ["performance_optimization"],
      },
      {
        id: "pub_sub",
        name: "Publish/Subscribe",
        prerequisites: ["basic_redis"],
        dependents: ["real_time_systems"],
      },
    ];

    skills.forEach((skill) => this.skillGraph.set(skill.id, skill));
  }

  /**
   * Helper methods for skill assessment and suggestions
   */
  private assessCurrentSkills(
    profile: UserLearningProfile,
    history: ConversationMessage[],
  ): SkillAssessment {
    const demonstratedSkills = this.extractDemonstratedSkills(history);
    const allSkills = [
      ...new Set([...profile.knownConcepts, ...demonstratedSkills]),
    ];
    const skillAreas = this.evaluateSkillAreas(allSkills, history);
    const overallLevel = this.calculateOverallLevel(skillAreas);

    return {
      assessmentId: `assessment-${Date.now()}`,
      timestamp: new Date(),
      skillAreas,
      overallLevel,
      recommendations: this.generateSkillRecommendations(skillAreas),
      strengthsIdentified: skillAreas
        .filter((s) => s.confidence > 0.7)
        .map((s) => s.skill),
      areasForImprovement: skillAreas
        .filter((s) => s.confidence < 0.5)
        .map((s) => s.skill),
      nextLearningGoals: this.generateNextGoals(skillAreas, profile),
    };
  }

  private extractDemonstratedSkills(history: ConversationMessage[]): string[] {
    const skills = new Set<string>();
    history.forEach((msg) => {
      if (msg.metadata?.commandsUsed) {
        msg.metadata.commandsUsed.forEach((cmd) =>
          skills.add(cmd.toLowerCase()),
        );
      }
      if (msg.metadata?.patternsDetected) {
        msg.metadata.patternsDetected.forEach((pattern) => skills.add(pattern));
      }
    });
    return Array.from(skills);
  }

  private evaluateSkillAreas(
    skills: string[],
    history: ConversationMessage[],
  ): SkillEvaluation[] {
    const skillCategories = [
      "basic_operations",
      "data_structures",
      "caching",
      "performance",
    ];

    return skillCategories.map((category) => {
      const categorySkills = this.getCategorySkills(category);
      const demonstratedCount = skills.filter((skill) =>
        categorySkills.includes(skill),
      ).length;
      const confidence = Math.min(
        1.0,
        demonstratedCount / Math.max(1, categorySkills.length),
      );

      return {
        skill: category,
        currentLevel: this.mapConfidenceToLevel(confidence),
        confidence,
        evidencePoints: skills.filter((skill) =>
          categorySkills.includes(skill),
        ),
        improvementSuggestions: this.generateImprovementSuggestions(
          category,
          confidence,
        ),
      };
    });
  }

  private getCategorySkills(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      basic_operations: ["get", "set", "del", "exists"],
      data_structures: ["hset", "hget", "lpush", "sadd", "zadd"],
      caching: ["expire", "ttl", "caching"],
      performance: ["pipeline", "multi", "performance_optimization"],
    };
    return categoryMap[category] || [];
  }

  private mapConfidenceToLevel(
    confidence: number,
  ): "novice" | "beginner" | "intermediate" | "advanced" | "expert" {
    if (confidence >= 0.9) return "expert";
    if (confidence >= 0.7) return "advanced";
    if (confidence >= 0.5) return "intermediate";
    if (confidence >= 0.3) return "beginner";
    return "novice";
  }

  private calculateOverallLevel(skillAreas: SkillEvaluation[]): string {
    const avgConfidence =
      skillAreas.reduce((sum, area) => sum + area.confidence, 0) /
      skillAreas.length;
    return this.mapConfidenceToLevel(avgConfidence);
  }

  private generateSkillRecommendations(
    skillAreas: SkillEvaluation[],
  ): string[] {
    const recommendations: string[] = [];
    const weakAreas = skillAreas.filter((area) => area.confidence < 0.5);

    if (weakAreas.length > 0) {
      recommendations.push(
        `Focus on strengthening: ${weakAreas.map((a) => a.skill).join(", ")}`,
      );
    }

    recommendations.push("Practice with hands-on exercises regularly");
    recommendations.push("Explore real-world use cases and patterns");

    return recommendations;
  }

  private generateNextGoals(
    skillAreas: SkillEvaluation[],
    profile: UserLearningProfile,
  ): string[] {
    const goals: string[] = [];
    const readyForNext = skillAreas.filter((area) => area.confidence > 0.6);

    readyForNext.forEach((area) => {
      const nextSkills = this.getNextSkills(area.skill);
      goals.push(...nextSkills);
    });

    goals.push(...profile.learningGoals);
    return [...new Set(goals)].slice(0, 5);
  }

  private getNextSkills(currentSkill: string): string[] {
    const progressionMap: Record<string, string[]> = {
      basic_operations: ["data_structures", "caching"],
      data_structures: ["caching", "performance"],
      caching: ["performance", "advanced_patterns"],
      performance: ["advanced_patterns", "production_deployment"],
    };
    return progressionMap[currentSkill] || [];
  }

  // Additional helper methods
  private identifyNextConcepts(
    assessment: SkillAssessment,
    profile: UserLearningProfile,
  ): string[] {
    return ["caching_patterns", "performance_optimization", "pub_sub"];
  }

  private generateConceptSuggestions(
    concept: string,
    assessment: SkillAssessment,
    profile: UserLearningProfile,
  ): ProgressionSuggestion[] {
    return [
      {
        id: `concept-${concept}`,
        type: "next_concept",
        title: `Learn ${concept}`,
        description: `Advance your skills by learning ${concept}`,
        reasoning: "Next logical step in your learning progression",
        priority: "medium",
        estimatedBenefit: "Enhanced Redis proficiency",
        prerequisites: [],
        resources: [],
        estimatedTime: "2-4 hours",
      },
    ];
  }

  private generateReinforcementSuggestions(
    assessment: SkillAssessment,
    history: ConversationMessage[],
  ): ProgressionSuggestion[] {
    return [];
  }

  private generateApplicationSuggestions(
    assessment: SkillAssessment,
    profile: UserLearningProfile,
  ): ProgressionSuggestion[] {
    return [];
  }

  private rankSuggestions(
    suggestions: ProgressionSuggestion[],
    profile: UserLearningProfile,
  ): ProgressionSuggestion[] {
    return suggestions.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private selectBasePath(
    profile: UserLearningProfile,
    goals: string[],
  ): LearningPath {
    return (
      this.learningPaths.get(profile.experienceLevel) ||
      this.learningPaths.get("beginner")!
    );
  }

  private customizeMilestones(
    baseMilestones: LearningMilestone[],
    profile: UserLearningProfile,
    goals: string[],
  ): LearningMilestone[] {
    return baseMilestones;
  }

  private initializeProgressTracking(
    milestones: LearningMilestone[],
  ): ProgressMetrics {
    return {
      completionPercentage: 0,
      milestonesCompleted: 0,
      totalMilestones: milestones.length,
      skillsAcquired: [],
      timeSpent: 0,
      strengthAreas: [],
      improvementAreas: [],
      nextRecommendations: [],
    };
  }

  private calculateEstimatedDuration(milestones: LearningMilestone[]): string {
    return "2-4 weeks";
  }

  private calculateUpdatedProgress(
    path: LearningPath,
    milestoneId: string,
    completedExercises: string[],
  ): ProgressMetrics {
    return path.progressTracking;
  }

  private generateNextMilestoneSuggestions(
    path: LearningPath,
    milestone: LearningMilestone,
    progress: ProgressMetrics,
  ): ProgressionSuggestion[] {
    return [];
  }

  private checkAchievements(
    path: LearningPath,
    progress: ProgressMetrics,
  ): Achievement[] {
    return [];
  }

  private generateImprovementSuggestions(
    category: string,
    confidence: number,
  ): string[] {
    return [
      `Practice more ${category} exercises`,
      `Review ${category} fundamentals`,
    ];
  }
}

interface SkillNode {
  id: string;
  name: string;
  prerequisites: string[];
  dependents: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
}

export default ProgressionSuggestionEngine;

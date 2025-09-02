/**
 * Command Discovery and Workflow Recommendations Engine
 * Provides intelligent discovery of related commands and workflow suggestions
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { UserLearningProfile } from "../conversational/followup-generator.js";

export interface CommandDiscoveryRequest {
  baseCommand: string;
  context: EnhancedQueryContext;
  userProfile: UserLearningProfile;
  discoveryType:
    | "related"
    | "alternative"
    | "complementary"
    | "sequential"
    | "comprehensive";
  maxResults?: number;
  includeWorkflows?: boolean;
}

export interface DiscoveredCommand {
  command: string;
  relationship: CommandRelationship;
  description: string;
  useCases: string[];
  examples: CommandExample[];
  complexity: "beginner" | "intermediate" | "advanced" | "expert";
  relevanceScore: number; // 0-1
}

export interface CommandRelationship {
  type:
    | "similar_function"
    | "complementary"
    | "prerequisite"
    | "builds_on"
    | "alternative"
    | "workflow_next";
  strength: number; // 0-1
  explanation: string;
  commonPatterns: string[];
}

export interface CommandExample {
  scenario: string;
  code: string;
  explanation: string;
  expectedResult: string;
  bestPractices: string[];
}

export interface WorkflowRecommendation {
  workflowId: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  steps: WorkflowStep[];
  commands: string[];
  patterns: string[];
  complexity: "simple" | "moderate" | "complex" | "advanced";
  estimatedTime: string;
  realWorldExamples: RealWorldExample[];
}

export interface WorkflowStep {
  stepNumber: number;
  action: string;
  commands: WorkflowCommand[];
  reasoning: string;
  alternatives: Alternative[];
}

export interface WorkflowCommand {
  command: string;
  parameters: CommandParameter[];
  purpose: string;
  timing: "immediate" | "conditional" | "batched" | "async";
}

export interface CommandParameter {
  name: string;
  value: string;
  description: string;
  required: boolean;
}

export interface Alternative {
  approach: string;
  commands: string[];
  tradeoffs: string[];
  whenToUse: string;
}

export interface RealWorldExample {
  title: string;
  scenario: string;
  implementation: string;
  codeSnippet: string;
  benefits: string[];
}

export interface WorkflowCategory {
  category:
    | "caching"
    | "session_management"
    | "rate_limiting"
    | "pub_sub"
    | "leaderboards"
    | "queue_processing"
    | "analytics"
    | "distributed_locking";
  subcategory?: string;
  applicableContexts: string[];
}

export interface DiscoveryResult {
  baseCommand: string;
  discoveredCommands: DiscoveredCommand[];
  workflowRecommendations: WorkflowRecommendation[];
  insights: DiscoveryInsight[];
  totalDiscovered: number;
}

export interface DiscoveryInsight {
  type:
    | "pattern_match"
    | "optimization_opportunity"
    | "learning_gap"
    | "best_practice";
  insight: string;
  relevantCommands: string[];
  actionableAdvice: string[];
  confidence: number;
}

export interface CommandNode {
  command: string;
  category: string;
  complexity: number;
  popularity: number;
  features: string[];
}

export interface CommandEdge {
  from: string;
  to: string;
  relationshipType: string;
  weight: number;
  context: string[];
}

export class CommandDiscoveryEngine {
  private commandGraph: { nodes: CommandNode[]; edges: CommandEdge[] } = { nodes: [], edges: [] };
  private workflowDatabase: Map<string, WorkflowRecommendation[]> = new Map();
  private relationshipMatrix: Map<string, Map<string, CommandRelationship>> =
    new Map();

  constructor() {
    this.initializeCommandGraph();
    this.initializeWorkflowDatabase();
    this.buildRelationshipMatrix();
  }

  /**
   * Discover related commands based on a base command
   */
  async discoverRelatedCommands(
    request: CommandDiscoveryRequest,
  ): Promise<DiscoveryResult> {
    const baseCommand = request.baseCommand.toUpperCase();

    // Find directly related commands
    const directlyRelated = this.findDirectlyRelatedCommands(
      baseCommand,
      request,
    );

    // Find commands through workflows
    const workflowRelated = this.findWorkflowRelatedCommands(
      baseCommand,
      request,
    );

    // Combine and deduplicate
    const allDiscovered = this.combineAndDeduplicateCommands([
      ...directlyRelated,
      ...workflowRelated,
    ]);

    // Generate workflow recommendations
    const workflowRecommendations = this.generateWorkflowRecommendations(
      baseCommand,
      request,
    );

    // Generate insights
    const insights = this.generateDiscoveryInsights(
      baseCommand,
      allDiscovered,
      request,
    );

    // Rank and filter results
    const rankedCommands = this.rankDiscoveredCommands(allDiscovered, request);
    const filteredCommands = rankedCommands.slice(0, request.maxResults || 15);

    return {
      baseCommand,
      discoveredCommands: filteredCommands,
      workflowRecommendations: request.includeWorkflows
        ? await this.generateWorkflowRecommendations(baseCommand, request)
        : [],
      insights,
      totalDiscovered: allDiscovered.length,
    };
  }

  /**
   * Generate comprehensive workflow recommendations
   */
  async generateWorkflowRecommendations(
    baseCommand: string,
    request: CommandDiscoveryRequest,
  ): Promise<WorkflowRecommendation[]> {
    const workflows: WorkflowRecommendation[] = [];

    // Get workflows containing the base command
    const commandWorkflows = this.getWorkflowsForCommand(baseCommand);

    // Filter by user context and experience level
    const relevantWorkflows = commandWorkflows.filter((workflow) =>
      this.isWorkflowRelevant(workflow, request),
    );

    // Add context-specific workflows
    const contextualWorkflows = this.generateContextualWorkflows(
      baseCommand,
      request.context,
    );

    workflows.push(...relevantWorkflows, ...contextualWorkflows);

    // Rank workflows by relevance and complexity
    return this.rankWorkflows(workflows, request);
  }

  /**
   * Initialize command graph with Redis commands and relationships
   */
  private initializeCommandGraph(): void {
    const commands: CommandNode[] = [
      {
        command: "GET",
        category: "string",
        complexity: 1,
        popularity: 0.95,
        features: ["read", "single_key"],
      },
      {
        command: "SET",
        category: "string",
        complexity: 1,
        popularity: 0.95,
        features: ["write", "single_key"],
      },
      {
        command: "MGET",
        category: "string",
        complexity: 2,
        popularity: 0.75,
        features: ["read", "multiple_keys"],
      },
      {
        command: "HGET",
        category: "hash",
        complexity: 2,
        popularity: 0.85,
        features: ["read", "hash_field"],
      },
      {
        command: "HSET",
        category: "hash",
        complexity: 2,
        popularity: 0.85,
        features: ["write", "hash_field"],
      },
      {
        command: "XADD",
        category: "stream",
        complexity: 4,
        popularity: 0.6,
        features: ["write", "append_only"],
      },
      {
        command: "XREAD",
        category: "stream",
        complexity: 4,
        popularity: 0.55,
        features: ["read", "blocking"],
      },
    ];

    const edges: CommandEdge[] = [
      {
        from: "GET",
        to: "SET",
        relationshipType: "complementary",
        weight: 0.9,
        context: ["basic_operations"],
      },
      {
        from: "GET",
        to: "MGET",
        relationshipType: "builds_on",
        weight: 0.8,
        context: ["batch_operations"],
      },
      {
        from: "HGET",
        to: "HSET",
        relationshipType: "complementary",
        weight: 0.9,
        context: ["hash_operations"],
      },
      {
        from: "SET",
        to: "HSET",
        relationshipType: "alternative",
        weight: 0.6,
        context: ["data_storage"],
      },
      {
        from: "XADD",
        to: "XREAD",
        relationshipType: "workflow_next",
        weight: 0.9,
        context: ["stream_processing"],
      },
    ];

    this.commandGraph = { nodes: commands, edges };
  }

  /**
   * Initialize workflow database with common Redis patterns
   */
  private initializeWorkflowDatabase(): void {
    const cacheAsideWorkflow: WorkflowRecommendation = {
      workflowId: "cache_aside_pattern",
      name: "Cache-Aside Pattern",
      description:
        "Implement cache-aside pattern for application-level caching",
      category: {
        category: "caching",
        subcategory: "cache_aside",
        applicableContexts: ["web_applications", "api_optimization"],
      },
      steps: [
        {
          stepNumber: 1,
          action: "Check cache for data",
          commands: [
            {
              command: "GET",
              parameters: [
                {
                  name: "key",
                  value: "cache_key",
                  description: "Cache key to check",
                  required: true,
                },
              ],
              purpose: "Attempt to retrieve cached data",
              timing: "immediate",
            },
          ],
          reasoning:
            "First check if data exists in cache to avoid database hit",
          alternatives: [
            {
              approach: "Use MGET for multiple keys",
              commands: ["MGET"],
              tradeoffs: [
                "More efficient for multiple items",
                "More complex logic",
              ],
              whenToUse: "When checking multiple cache keys simultaneously",
            },
          ],
        },
      ],
      commands: ["GET", "SET"],
      patterns: ["cache_aside", "lazy_loading"],
      complexity: "moderate",
      estimatedTime: "30 minutes",
      realWorldExamples: [
        {
          title: "User Profile Caching",
          scenario: "Cache user profile data to reduce database load",
          implementation:
            "Check cache first, query database on miss, update cache",
          codeSnippet: `async function getUserProfile(userId: string) {
  const cacheKey = \`user:\${userId}\`;
  let profile = await redis.get(cacheKey);
  
  if (!profile) {
    profile = await database.getUserProfile(userId);
    await redis.setex(cacheKey, 3600, JSON.stringify(profile));
  }
  
  return JSON.parse(profile);
}`,
          benefits: [
            "Reduced database load",
            "Faster response times",
            "Improved scalability",
          ],
        },
      ],
    };

    this.workflowDatabase.set("GET", [cacheAsideWorkflow]);
    this.workflowDatabase.set("SET", [cacheAsideWorkflow]);
  }

  /**
   * Build relationship matrix for command discovery
   */
  private buildRelationshipMatrix(): void {
    this.commandGraph.edges.forEach((edge) => {
      if (!this.relationshipMatrix.has(edge.from)) {
        this.relationshipMatrix.set(edge.from, new Map());
      }

      this.relationshipMatrix.get(edge.from)!.set(edge.to, {
        type: edge.relationshipType as any,
        strength: edge.weight,
        explanation: `${edge.from} and ${edge.to} are related through ${edge.relationshipType}`,
        commonPatterns: edge.context,
      });
    });
  }

  /**
   * Find directly related commands using relationship matrix
   */
  private findDirectlyRelatedCommands(
    baseCommand: string,
    request: CommandDiscoveryRequest,
  ): DiscoveredCommand[] {
    const discovered: DiscoveredCommand[] = [];
    const relationships = this.relationshipMatrix.get(baseCommand);

    if (!relationships) return discovered;

    relationships.forEach((relationship, relatedCommand) => {
      const commandNode = this.commandGraph.nodes.find(
        (n) => n.command === relatedCommand,
      );
      if (!commandNode) return;

      if (this.matchesDiscoveryType(relationship.type, request.discoveryType)) {
        discovered.push({
          command: relatedCommand,
          relationship,
          description: this.generateCommandDescription(commandNode),
          useCases: this.generateUseCases(commandNode),
          examples: this.generateExamples(relatedCommand),
          complexity: this.mapComplexity(commandNode.complexity),
          relevanceScore: relationship.strength,
        });
      }
    });

    return discovered;
  }

  private findWorkflowRelatedCommands(
    baseCommand: string,
    request: CommandDiscoveryRequest,
  ): DiscoveredCommand[] {
    const discovered: DiscoveredCommand[] = [];
    const workflows = this.workflowDatabase.get(baseCommand) || [];

    workflows.forEach((workflow) => {
      workflow.commands.forEach((cmd) => {
        if (cmd !== baseCommand) {
          const commandNode = this.commandGraph.nodes.find(
            (n) => n.command === cmd,
          );
          if (commandNode) {
            discovered.push({
              command: cmd,
              relationship: {
                type: "workflow_next",
                strength: 0.7,
                explanation: `Part of ${workflow.name} workflow`,
                commonPatterns: [workflow.category.category],
              },
              description: this.generateCommandDescription(commandNode),
              useCases: workflow.realWorldExamples.map((ex) => ex.title),
              examples: this.generateExamples(cmd),
              complexity: this.mapComplexity(commandNode.complexity),
              relevanceScore: 0.7,
            });
          }
        }
      });
    });

    return discovered;
  }

  private combineAndDeduplicateCommands(
    commands: DiscoveredCommand[],
  ): DiscoveredCommand[] {
    const commandMap = new Map<string, DiscoveredCommand>();

    commands.forEach((cmd) => {
      if (
        !commandMap.has(cmd.command) ||
        commandMap.get(cmd.command)!.relevanceScore < cmd.relevanceScore
      ) {
        commandMap.set(cmd.command, cmd);
      }
    });

    return Array.from(commandMap.values());
  }

  private rankDiscoveredCommands(
    commands: DiscoveredCommand[],
    request: CommandDiscoveryRequest,
  ): DiscoveredCommand[] {
    return commands.sort((a, b) => {
      const aScore =
        a.relevanceScore *
        this.getExperienceMultiplier(
          a.complexity,
          request.userProfile.experienceLevel,
        );
      const bScore =
        b.relevanceScore *
        this.getExperienceMultiplier(
          b.complexity,
          request.userProfile.experienceLevel,
        );
      return bScore - aScore;
    });
  }

  private getExperienceMultiplier(
    complexity: string,
    experienceLevel: string,
  ): number {
    const complexityScores = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };
    const experienceScores = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4,
    };

    const complexityScore =
      complexityScores[complexity as keyof typeof complexityScores] || 2;
    const experienceScore =
      experienceScores[experienceLevel as keyof typeof experienceScores] || 2;

    const diff = Math.abs(complexityScore - experienceScore);
    return Math.max(0.3, 1 - diff * 0.2);
  }

  // Helper methods
  private matchesDiscoveryType(
    relationshipType: string,
    discoveryType: string,
  ): boolean {
    const typeMatches: Record<string, string[]> = {
      related: ["similar_function", "complementary", "builds_on"],
      alternative: ["alternative"],
      complementary: ["complementary"],
      sequential: ["workflow_next", "builds_on"],
      comprehensive: [
        "similar_function",
        "complementary",
        "prerequisite",
        "builds_on",
        "alternative",
        "workflow_next",
      ],
    };

    return typeMatches[discoveryType]?.includes(relationshipType) || false;
  }

  private generateCommandDescription(node: CommandNode): string {
    return `${node.command} is a ${node.category} command with ${node.complexity}/5 complexity`;
  }

  private generateUseCases(node: CommandNode): string[] {
    const categoryUseCases: Record<string, string[]> = {
      string: ["Caching", "Session storage", "Configuration"],
      hash: ["Object storage", "User profiles", "Settings"],
      stream: ["Event sourcing", "Real-time analytics", "Message queues"],
    };

    return categoryUseCases[node.category] || ["General purpose"];
  }

  private generateExamples(command: string): CommandExample[] {
    return [
      {
        scenario: "Basic usage",
        code: `await client.${command.toLowerCase()}(...)`,
        explanation: `Example usage of ${command}`,
        expectedResult: "Success",
        bestPractices: ["Use appropriate error handling"],
      },
    ];
  }

  private mapComplexity(
    complexity: number,
  ): "beginner" | "intermediate" | "advanced" | "expert" {
    if (complexity <= 1) return "beginner";
    if (complexity <= 2) return "intermediate";
    if (complexity <= 3) return "advanced";
    return "expert";
  }

  private getWorkflowsForCommand(command: string): WorkflowRecommendation[] {
    return this.workflowDatabase.get(command) || [];
  }

  private isWorkflowRelevant(
    workflow: WorkflowRecommendation,
    request: CommandDiscoveryRequest,
  ): boolean {
    return true; // Simplified for now
  }

  private generateContextualWorkflows(
    baseCommand: string,
    context: EnhancedQueryContext,
  ): WorkflowRecommendation[] {
    return []; // Simplified for now
  }

  private rankWorkflows(
    workflows: WorkflowRecommendation[],
    request: CommandDiscoveryRequest,
  ): WorkflowRecommendation[] {
    return workflows.sort(
      (a, b) => b.realWorldExamples.length - a.realWorldExamples.length,
    );
  }

  private generateDiscoveryInsights(
    baseCommand: string,
    commands: DiscoveredCommand[],
    request: CommandDiscoveryRequest,
  ): DiscoveryInsight[] {
    return [
      {
        type: "pattern_match",
        insight: `Discovered ${commands.length} related commands for ${baseCommand}`,
        relevantCommands: commands.map((c) => c.command),
        actionableAdvice: [
          "Explore the discovered commands",
          "Practice with examples",
        ],
        confidence: 0.8,
      },
    ];
  }
}

// Export statement removed to prevent conflicts - already exported inline

export default CommandDiscoveryEngine;

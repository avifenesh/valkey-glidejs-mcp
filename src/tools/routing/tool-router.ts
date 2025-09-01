/**
 * Tool Router - Intelligent routing system for consolidated tools
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRoutingContext } from "./context-analyzer.js";

export interface SmartTool {
  name: string;
  capabilities: string[];
  complexity: number;
  supports: (context: ToolRoutingContext) => boolean;
  execute: (args: any, context: ToolRoutingContext) => Promise<any>;
}

export class ToolRouter {
  private tools: Map<string, SmartTool> = new Map();

  /**
   * Register a smart tool with the router
   */
  registerTool(tool: SmartTool) {
    this.tools.set(tool.name, tool);
  }

  /**
   * Route a request to the most appropriate tool
   */
  async route(
    toolName: string,
    args: any,
    context: ToolRoutingContext,
  ): Promise<any> {
    // Try exact match first
    const exactTool = this.tools.get(toolName);
    if (exactTool && exactTool.supports(context)) {
      return exactTool.execute(args, context);
    }

    // Find best matching tool
    const candidates = Array.from(this.tools.values())
      .filter((tool) => tool.supports(context))
      .sort((a, b) => {
        // Prefer tools with matching complexity
        const aComplexityMatch = this.matchesComplexity(a, context.complexity);
        const bComplexityMatch = this.matchesComplexity(b, context.complexity);

        if (aComplexityMatch && !bComplexityMatch) return -1;
        if (!aComplexityMatch && bComplexityMatch) return 1;

        // Then prefer tools with more specific capabilities
        return b.capabilities.length - a.capabilities.length;
      });

    if (candidates.length === 0) {
      throw new Error(
        `No suitable tool found for ${toolName} with context ${JSON.stringify(context)}`,
      );
    }

    return candidates[0].execute(args, context);
  }

  /**
   * Get available tools for a given context
   */
  getAvailableTools(context: ToolRoutingContext): SmartTool[] {
    return Array.from(this.tools.values()).filter((tool) =>
      tool.supports(context),
    );
  }

  private matchesComplexity(tool: SmartTool, complexity: string): boolean {
    switch (complexity) {
      case "simple":
        return tool.complexity <= 2;
      case "intermediate":
        return tool.complexity >= 2 && tool.complexity <= 4;
      case "advanced":
        return tool.complexity >= 4;
      default:
        return true;
    }
  }
}

/**
 * Global router instance
 */
export const globalRouter = new ToolRouter();

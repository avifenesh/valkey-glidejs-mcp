import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z, ZodType, ZodRawShape } from "zod";

/**
 * Enhanced MCP tool wrapper that handles multiple parameter formats
 * for maximum compatibility across different MCP clients
 */

export interface EnhancedToolConfig<T extends ZodRawShape> {
  name: string;
  description: string;
  zodSchema: T;
  handler: (args: { [K in keyof T]: z.infer<T[K]> }) => Promise<{
    content: Array<{ type: string; text: string }>;
    structuredContent?: Record<string, any>;
  }>;
}

/**
 * Simple parameter validation that handles multiple formats
 */
function validateAndParseParams<T extends ZodRawShape>(
  args: any, 
  zodSchema: T
): { success: true; data: { [K in keyof T]: z.infer<T[K]> } } | { success: false; error: string } {
  try {
    // Handle null/undefined
    if (args === null || args === undefined) {
      args = {};
    }

    // Handle string format (JSON or single parameter)
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args);
      } catch {
        // Single parameter case
        const keys = Object.keys(zodSchema);
        if (keys.length === 1) {
          args = { [keys[0]]: args };
        } else {
          return { success: false, error: `Cannot parse string parameter for multi-parameter tool` };
        }
      }
    }

    // Ensure args is object
    if (typeof args !== 'object') {
      return { success: false, error: `Expected object parameters, got ${typeof args}` };
    }

    // Validate each parameter
    const result: any = {};
    const errors: string[] = [];

    Object.entries(zodSchema).forEach(([key, zodType]) => {
      const type = zodType as ZodType;
      const value = args[key];

      try {
        result[key] = type.parse(value);
      } catch (error) {
        // Try type coercion for compatibility
        try {
          if (type instanceof z.ZodNumber && typeof value === 'string') {
            result[key] = type.parse(parseFloat(value));
          } else if (type instanceof z.ZodBoolean && typeof value === 'string') {
            result[key] = type.parse(value === 'true' || value === '1');
          } else if (type instanceof z.ZodOptional && value === undefined) {
            // Optional field can be undefined
            result[key] = undefined;
          } else {
            throw error;
          }
        } catch (finalError) {
          errors.push(`${key}: ${finalError instanceof Error ? finalError.message : 'Invalid'}`);
        }
      }
    });

    if (errors.length > 0) {
      return { success: false, error: `Validation errors: ${errors.join(', ')}` };
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown parsing error' };
  }
}


/**
 * Register enhanced MCP tool with dual schema support
 */
export function registerEnhancedTool<T extends ZodRawShape>(
  mcp: McpServer, 
  config: EnhancedToolConfig<T>
) {
  const { name, description, zodSchema, handler } = config;
  
  // Register tool with enhanced parameter handling
  mcp.tool(
    name,
    description,
    zodSchema as any,
    async (args: any) => {
      // Validate and parse parameters
      const validation = validateAndParseParams(args, zodSchema);
      
      if (!validation.success) {
        return {
          content: [
            { 
              type: "text", 
              text: `❌ Parameter Error in ${name}: ${validation.error}`
            },
            {
              type: "text",
              text: `Received (${typeof args}): ${JSON.stringify(args, null, 2)}`
            }
          ],
          structuredContent: { 
            error: validation.error,
            receivedArgs: args,
            argType: typeof args,
            tool: name,
            success: false
          }
        } as any;
      }

      try {
        // Call handler with validated arguments
        const result = await handler(validation.data);
        return result as any;
      } catch (error) {
        return {
          content: [
            { 
              type: "text", 
              text: `❌ Execution Error in ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ],
          structuredContent: { 
            error: error instanceof Error ? error.message : 'Unknown error',
            tool: name,
            success: false
          }
        } as any;
      }
    }
  );
}

/**
 * Quick helper for simple tools with no parameters
 */
export function registerSimpleTool(
  mcp: McpServer,
  name: string,
  description: string,
  handler: () => Promise<{
    content: Array<{ type: string; text: string }>;
    structuredContent?: Record<string, any>;
  }>
) {
  mcp.tool(name, description, {}, async () => {
    const result = await handler();
    return result as any;
  });
}
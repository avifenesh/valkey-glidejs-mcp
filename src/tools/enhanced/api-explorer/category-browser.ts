/**
 * Category Browsing System for Enhanced API Explorer
 * Provides organized browsing of Redis commands by categories with examples and use cases
 */

import { EnhancedQueryContext } from "../../core/analysis/query-analyzer.js";
import { CommandRegistry } from "../../core/database/command-registry.js";
import { CommandHandlers, CommandHandlerResult } from "./command-handlers.js";

export interface CategoryInfo {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  commands: string[];
  commonUseCases: string[];
  complexity: "beginner" | "intermediate" | "advanced";
  popularCommands: string[];
  examples: CategoryExample[];
}

export interface CategoryExample {
  title: string;
  description: string;
  commands: string[];
  code: string;
  complexity: "simple" | "intermediate" | "advanced";
  useCase: string;
}

export interface BrowsingResult {
  category: CategoryInfo;
  commandDetails: CommandHandlerResult[];
  relatedCategories: string[];
  nextSteps: string[];
  learningPath: string[];
}

export class CategoryBrowser {
  private static categories: Map<string, CategoryInfo> = new Map();

  static {
    this.initializeCategories();
  }

  /**
   * Initialize all Redis command categories
   */
  private static initializeCategories(): void {
    // String Operations
    this.categories.set("strings", {
      name: "strings",
      displayName: "Strings",
      description:
        "Basic key-value operations for storing and retrieving string data",
      icon: "📝",
      commands: [
        "GET",
        "SET",
        "MGET",
        "MSET",
        "INCR",
        "DECR",
        "APPEND",
        "STRLEN",
      ],
      commonUseCases: [
        "Simple caching",
        "Configuration storage",
        "Session data",
        "Counters and metrics",
        "Feature flags",
      ],
      complexity: "beginner",
      popularCommands: ["GET", "SET", "MGET", "MSET"],
      examples: [
        {
          title: "Simple Cache Implementation",
          description: "Basic caching pattern with automatic expiration",
          commands: ["SET", "GET"],
          code: `// Set cache with 1 hour expiration
await client.set("user:123", JSON.stringify(userData), { EX: 3600 });

// Retrieve from cache
const cached = await client.get("user:123");
if (cached) {
  return JSON.parse(cached);
}`,
          complexity: "simple",
          useCase: "caching",
        },
        {
          title: "Atomic Counter",
          description: "Thread-safe counter implementation",
          commands: ["INCR", "DECR", "GET"],
          code: `// Increment page views
const views = await client.incr("page:views:homepage");
console.log(\`Page views: \${views}\`);

// Daily counter with expiration
const dailyKey = \`visits:\${new Date().toISOString().split('T')[0]}\`;
await client.incr(dailyKey);
await client.expire(dailyKey, 86400); // Expire after 24 hours`,
          complexity: "intermediate",
          useCase: "metrics",
        },
      ],
    });

    // Hash Operations
    this.categories.set("hashes", {
      name: "hashes",
      displayName: "Hashes",
      description:
        "Store objects as field-value pairs, perfect for structured data",
      icon: "🏗️",
      commands: [
        "HGET",
        "HSET",
        "HGETALL",
        "HMGET",
        "HMSET",
        "HDEL",
        "HEXISTS",
        "HKEYS",
        "HVALS",
      ],
      commonUseCases: [
        "User profiles",
        "Product catalogs",
        "Configuration objects",
        "Shopping carts",
        "Session storage",
      ],
      complexity: "beginner",
      popularCommands: ["HGET", "HSET", "HGETALL", "HMGET"],
      examples: [
        {
          title: "User Profile Management",
          description: "Complete user profile with efficient field access",
          commands: ["HSET", "HGET", "HGETALL"],
          code: `// Create user profile
await client.hset("user:456", {
  name: "Alice Smith",
  email: "alice@example.com",
  age: "28",
  lastLogin: Date.now().toString()
});

// Get specific field
const name = await client.hget("user:456", "name");

// Get entire profile
const profile = await client.hgetall("user:456");`,
          complexity: "simple",
          useCase: "user-management",
        },
        {
          title: "Shopping Cart",
          description: "Dynamic shopping cart with item management",
          commands: ["HSET", "HDEL", "HGETALL", "HINCRBY"],
          code: `const cartKey = "cart:user123";

// Add item to cart
await client.hset(cartKey, "product:456", "2"); // quantity: 2

// Update quantity
await client.hincrby(cartKey, "product:456", 1); // increment by 1

// Remove item
await client.hdel(cartKey, "product:456");

// Get all cart items
const cart = await client.hgetall(cartKey);`,
          complexity: "intermediate",
          useCase: "e-commerce",
        },
      ],
    });

    // List Operations
    this.categories.set("lists", {
      name: "lists",
      displayName: "Lists",
      description: "Ordered collections for queues, stacks, and timeline data",
      icon: "📋",
      commands: [
        "LPUSH",
        "RPUSH",
        "LPOP",
        "RPOP",
        "LRANGE",
        "LLEN",
        "LINDEX",
        "LSET",
      ],
      commonUseCases: [
        "Task queues",
        "Activity feeds",
        "Message queues",
        "Recent items lists",
        "Undo operations",
      ],
      complexity: "intermediate",
      popularCommands: ["LPUSH", "RPUSH", "LPOP", "LRANGE"],
      examples: [
        {
          title: "Task Queue",
          description: "Producer-consumer task queue implementation",
          commands: ["LPUSH", "RPOP", "LLEN"],
          code: `// Producer: Add tasks to queue
await client.lpush("tasks:pending", JSON.stringify({
  id: "task123",
  type: "email",
  data: { to: "user@example.com", subject: "Welcome" }
}));

// Consumer: Process tasks
while (true) {
  const task = await client.rpop("tasks:pending");
  if (task) {
    const taskData = JSON.parse(task);
    await processTask(taskData);
  } else {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}`,
          complexity: "intermediate",
          useCase: "task-processing",
        },
        {
          title: "Activity Feed",
          description: "Recent activities with automatic trimming",
          commands: ["LPUSH", "LRANGE", "LTRIM"],
          code: `// Add new activity
await client.lpush("feed:user123", JSON.stringify({
  timestamp: Date.now(),
  action: "liked",
  target: "post:456"
}));

// Keep only last 100 activities
await client.ltrim("feed:user123", 0, 99);

// Get recent activities
const recent = await client.lrange("feed:user123", 0, 9);
const activities = recent.map(item => JSON.parse(item));`,
          complexity: "advanced",
          useCase: "social-media",
        },
      ],
    });

    // Set Operations
    this.categories.set("sets", {
      name: "sets",
      displayName: "Sets",
      description:
        "Unique collections for tags, relationships, and set operations",
      icon: "🔗",
      commands: [
        "SADD",
        "SREM",
        "SMEMBERS",
        "SCARD",
        "SINTER",
        "SUNION",
        "SDIFF",
        "SISMEMBER",
      ],
      commonUseCases: [
        "Tagging systems",
        "Friend relationships",
        "Unique visitors",
        "Permission sets",
        "Category filters",
      ],
      complexity: "intermediate",
      popularCommands: ["SADD", "SMEMBERS", "SINTER", "SISMEMBER"],
      examples: [
        {
          title: "Tagging System",
          description: "Article tagging with tag intersection",
          commands: ["SADD", "SMEMBERS", "SINTER"],
          code: `// Tag articles
await client.sadd("tags:tech", "article:1", "article:2", "article:5");
await client.sadd("tags:programming", "article:1", "article:3", "article:5");

// Find articles with both tags
const commonArticles = await client.sinter("tags:tech", "tags:programming");

// Get all tech articles
const techArticles = await client.smembers("tags:tech");`,
          complexity: "simple",
          useCase: "content-management",
        },
        {
          title: "User Permissions",
          description: "Role-based permission system",
          commands: ["SADD", "SISMEMBER", "SUNION"],
          code: `// Define role permissions
await client.sadd("role:admin", "read", "write", "delete", "manage");
await client.sadd("role:editor", "read", "write");
await client.sadd("role:viewer", "read");

// Check user permission
const hasPermission = await client.sismember("role:editor", "delete");

// Get all user permissions (user has multiple roles)
const userRoles = ["role:editor", "role:viewer"];
const permissions = await client.sunion(...userRoles);`,
          complexity: "advanced",
          useCase: "access-control",
        },
      ],
    });

    // Sorted Sets
    this.categories.set("sortedsets", {
      name: "sortedsets",
      displayName: "Sorted Sets",
      description:
        "Ranked collections for leaderboards, time-series, and priority systems",
      icon: "🏆",
      commands: [
        "ZADD",
        "ZRANGE",
        "ZREVRANGE",
        "ZRANK",
        "ZSCORE",
        "ZREM",
        "ZINCRBY",
      ],
      commonUseCases: [
        "Leaderboards",
        "Priority queues",
        "Time-series data",
        "Trending content",
        "Rate limiting",
      ],
      complexity: "intermediate",
      popularCommands: ["ZADD", "ZRANGE", "ZRANK", "ZSCORE"],
      examples: [
        {
          title: "Game Leaderboard",
          description: "Real-time leaderboard with rankings",
          commands: ["ZADD", "ZREVRANGE", "ZRANK"],
          code: `// Add/update player scores
await client.zadd("leaderboard:global", {
  "player123": 1500,
  "player456": 1750,
  "player789": 1320
});

// Get top 10 players
const topPlayers = await client.zrevrange("leaderboard:global", 0, 9, {
  WITHSCORES: true
});

// Get specific player rank (0-based, so add 1)
const rank = await client.zrevrank("leaderboard:global", "player123");
console.log(\`Player rank: \${rank + 1}\`);`,
          complexity: "intermediate",
          useCase: "gaming",
        },
        {
          title: "Time-Series Events",
          description: "Event timeline with timestamp-based ordering",
          commands: ["ZADD", "ZRANGEBYSCORE", "ZREMRANGEBYSCORE"],
          code: `// Add events with timestamps as scores
const now = Date.now();
await client.zadd("events:user123", {
  "login": now - 3600000,    // 1 hour ago
  "purchase": now - 1800000, // 30 minutes ago
  "logout": now - 900000     // 15 minutes ago
});

// Get events in last hour
const hourAgo = now - 3600000;
const recentEvents = await client.zrangebyscore("events:user123", hourAgo, now);

// Clean up events older than 24 hours
const dayAgo = now - 86400000;
await client.zremrangebyscore("events:user123", "-inf", dayAgo);`,
          complexity: "advanced",
          useCase: "analytics",
        },
      ],
    });

    // Streams
    this.categories.set("streams", {
      name: "streams",
      displayName: "Streams",
      description:
        "Append-only logs for real-time data processing and event sourcing",
      icon: "🌊",
      commands: [
        "XADD",
        "XREAD",
        "XREADGROUP",
        "XGROUP",
        "XLEN",
        "XRANGE",
        "XTRIM",
      ],
      commonUseCases: [
        "Event sourcing",
        "Real-time analytics",
        "Message streaming",
        "Audit logging",
        "Activity tracking",
      ],
      complexity: "advanced",
      popularCommands: ["XADD", "XREAD", "XGROUP", "XREADGROUP"],
      examples: [
        {
          title: "Event Logging",
          description: "Application event logging with stream processing",
          commands: ["XADD", "XREAD"],
          code: `// Log events to stream
await client.xadd("app:events", [
  ["event", "user_login"],
  ["userId", "123"],
  ["timestamp", Date.now().toString()],
  ["ip", "192.168.1.1"]
]);

// Read events from stream
const events = await client.xread([
  { key: "app:events", id: "0" }
], { COUNT: 10 });

events[0].entries.forEach(entry => {
  const event = Object.fromEntries(
    entry.elements.map((val, i, arr) => 
      i % 2 === 0 ? [val, arr[i + 1]] : null
    ).filter(Boolean)
  );
  console.log("Event:", event);
});`,
          complexity: "intermediate",
          useCase: "logging",
        },
        {
          title: "Consumer Groups",
          description: "Distributed event processing with consumer groups",
          commands: ["XGROUP", "XREADGROUP", "XACK"],
          code: `// Create consumer group
await client.xgroup("CREATE", "notifications", "processors", "$", {
  MKSTREAM: true
});

// Process events as part of consumer group
const messages = await client.xreadgroup(
  "processors", "worker-1", [
    { key: "notifications", id: ">" }
  ], { COUNT: 5, BLOCK: 1000 }
);

for (const stream of messages) {
  for (const entry of stream.entries) {
    try {
      await processNotification(entry);
      // Acknowledge successful processing
      await client.xack("notifications", "processors", entry.id);
    } catch (error) {
      console.error("Processing failed:", error);
      // Handle failed message (retry, dead letter queue, etc.)
    }
  }
}`,
          complexity: "advanced",
          useCase: "event-processing",
        },
      ],
    });

    // Geospatial
    this.categories.set("geo", {
      name: "geo",
      displayName: "Geospatial",
      description:
        "Location-based operations for mapping and proximity features",
      icon: "🌍",
      commands: ["GEOADD", "GEORADIUS", "GEODIST", "GEOHASH", "GEOPOS"],
      commonUseCases: [
        "Location tracking",
        "Proximity search",
        "Delivery routing",
        "Store locators",
        "Geofencing",
      ],
      complexity: "advanced",
      popularCommands: ["GEOADD", "GEORADIUS"],
      examples: [
        {
          title: "Store Locator",
          description: "Find nearby stores within radius",
          commands: ["GEOADD", "GEORADIUS"],
          code: `// Add store locations
await client.geoadd("stores", [
  { longitude: -122.4194, latitude: 37.7749, member: "store:sf" },
  { longitude: -74.0060, latitude: 40.7128, member: "store:nyc" },
  { longitude: -87.6298, latitude: 41.8781, member: "store:chicago" }
]);

// Find stores within 100km of user location
const userLon = -122.4000;
const userLat = 37.7849;
const nearbyStores = await client.georadius(
  "stores", userLon, userLat, 100, "km",
  { WITHDIST: true, WITHCOORD: true, COUNT: 5 }
);`,
          complexity: "intermediate",
          useCase: "location-services",
        },
      ],
    });

    // Pub/Sub
    this.categories.set("pubsub", {
      name: "pubsub",
      displayName: "Pub/Sub",
      description:
        "Real-time messaging for notifications and event broadcasting",
      icon: "📡",
      commands: ["PUBLISH", "SUBSCRIBE", "PSUBSCRIBE", "UNSUBSCRIBE"],
      commonUseCases: [
        "Real-time notifications",
        "Chat systems",
        "Live updates",
        "Event broadcasting",
        "Cache invalidation",
      ],
      complexity: "intermediate",
      popularCommands: ["PUBLISH", "SUBSCRIBE"],
      examples: [
        {
          title: "Real-time Notifications",
          description: "User notification system with channels",
          commands: ["PUBLISH", "SUBSCRIBE"],
          code: `// Subscribe to user notifications
await client.subscribe(["notifications:user123"], (message, channel) => {
  console.log(\`Notification on \${channel}:\`, message);
  // Update UI, send push notification, etc.
});

// Publish notification
await client.publish("notifications:user123", JSON.stringify({
  type: "message",
  from: "user456",
  content: "Hello there!"
}));`,
          complexity: "simple",
          useCase: "notifications",
        },
      ],
    });
  }

  /**
   * Browse commands by category
   */
  static async browseCategory(
    categoryName: string,
    context: EnhancedQueryContext,
    options?: {
      includeExamples?: boolean;
      maxCommands?: number;
      complexity?: "simple" | "intermediate" | "advanced";
    },
  ): Promise<BrowsingResult> {
    const category = this.categories.get(categoryName.toLowerCase());
    if (!category) {
      throw new Error(`Category '${categoryName}' not found`);
    }

    const opts = {
      includeExamples: true,
      maxCommands: 10,
      complexity: context.complexity,
      ...options,
    };

    // Get command details for the category
    const commandsToShow = category.commands.slice(0, opts.maxCommands);

    const commandDetails: CommandHandlerResult[] = [];
    for (const command of commandsToShow) {
      try {
        const details = await CommandHandlers.handleCommand(command, context);
        commandDetails.push(details);
      } catch (error) {
        console.warn(`Failed to get details for command ${command}:`, error);
      }
    }

    // Find related categories
    const relatedCategories = this.findRelatedCategories(categoryName, context);

    // Generate next steps based on user experience
    const nextSteps = this.generateNextSteps(category, context);

    // Create learning path
    const learningPath = this.createLearningPath(category, context);

    return {
      category,
      commandDetails,
      relatedCategories,
      nextSteps,
      learningPath,
    };
  }

  /**
   * Get all available categories
   */
  static getCategories(): CategoryInfo[] {
    return Array.from(this.categories.values()).sort((a, b) => {
      // Sort by complexity, then alphabetically
      const complexityOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      const diff =
        complexityOrder[a.complexity] - complexityOrder[b.complexity];
      return diff !== 0 ? diff : a.displayName.localeCompare(b.displayName);
    });
  }

  /**
   * Get category by name
   */
  static getCategory(name: string): CategoryInfo | undefined {
    return this.categories.get(name.toLowerCase());
  }

  /**
   * Search categories by keyword
   */
  static searchCategories(keyword: string): CategoryInfo[] {
    const lowerKeyword = keyword.toLowerCase();
    return Array.from(this.categories.values()).filter(
      (category) =>
        category.name.includes(lowerKeyword) ||
        category.displayName.toLowerCase().includes(lowerKeyword) ||
        category.description.toLowerCase().includes(lowerKeyword) ||
        category.commonUseCases.some((useCase) =>
          useCase.toLowerCase().includes(lowerKeyword),
        ),
    );
  }

  /**
   * Get categories by complexity level
   */
  static getCategoriesByComplexity(
    complexity: "beginner" | "intermediate" | "advanced",
  ): CategoryInfo[] {
    return Array.from(this.categories.values()).filter(
      (category) => category.complexity === complexity,
    );
  }

  /**
   * Find related categories based on use cases and commands
   */
  private static findRelatedCategories(
    categoryName: string,
    context: EnhancedQueryContext,
  ): string[] {
    const category = this.categories.get(categoryName);
    if (!category) return [];

    const related = new Set<string>();

    // Find categories with overlapping use cases
    for (const [name, cat] of this.categories) {
      if (name === categoryName) continue;

      const commonUseCases = category.commonUseCases.filter((useCase) =>
        cat.commonUseCases.some(
          (otherUseCase) =>
            otherUseCase.toLowerCase().includes(useCase.toLowerCase()) ||
            useCase.toLowerCase().includes(otherUseCase.toLowerCase()),
        ),
      );

      if (commonUseCases.length > 0) {
        related.add(cat.displayName);
      }
    }

    // Common relationships
    const relationships = {
      strings: ["hashes", "lists"],
      hashes: ["strings", "sets"],
      lists: ["strings", "streams"],
      sets: ["hashes", "sortedsets"],
      sortedsets: ["sets", "lists"],
      streams: ["lists", "pubsub"],
      pubsub: ["streams"],
      geo: ["sortedsets"],
    };

    const directRelated = relationships[categoryName as keyof typeof relationships] || [];
    directRelated.forEach((rel: string) => {
      const relCategory = this.categories.get(rel);
      if (relCategory) {
        related.add(relCategory.displayName);
      }
    });

    return Array.from(related).slice(0, 3);
  }

  /**
   * Generate contextual next steps
   */
  private static generateNextSteps(
    category: CategoryInfo,
    context: EnhancedQueryContext,
  ): string[] {
    const steps: string[] = [];

    if (context.userExperienceLevel === "beginner") {
      steps.push(
        `Try the basic ${category.displayName.toLowerCase()} commands: ${category.popularCommands.slice(0, 2).join(", ")}`,
      );
      steps.push(
        `Practice with simple examples from the '${category.examples[0]?.useCase}' use case`,
      );
      steps.push("Ask for step-by-step tutorials for specific commands");
    } else if (context.userExperienceLevel === "intermediate") {
      steps.push(
        `Explore advanced ${category.displayName.toLowerCase()} patterns`,
      );
      steps.push(
        `Learn about performance optimization for ${category.name} operations`,
      );
      steps.push("Try combining commands for complex workflows");
    } else {
      steps.push(
        `Master production patterns for ${category.displayName.toLowerCase()}`,
      );
      steps.push("Explore clustering and scaling considerations");
      steps.push("Learn about monitoring and troubleshooting");
    }

    return steps;
  }

  /**
   * Create learning path for category
   */
  private static createLearningPath(
    category: CategoryInfo,
    context: EnhancedQueryContext,
  ): string[] {
    const path: string[] = [];

    if (context.userExperienceLevel === "beginner") {
      path.push(
        `1. Start with ${category.popularCommands[0]} and ${category.popularCommands[1]}`,
      );
      path.push(`2. Practice basic ${category.name} operations`);
      path.push(`3. Learn common ${category.name} patterns`);
      path.push(`4. Try real-world examples`);
    } else {
      path.push(`1. Review ${category.name} best practices`);
      path.push(`2. Explore advanced use cases`);
      path.push(`3. Learn performance optimization`);
      path.push(`4. Master production patterns`);
    }

    return path;
  }
}

// Export convenience functions
export const browseCategory = CategoryBrowser.browseCategory;
export const getCategories = CategoryBrowser.getCategories;
export const searchCategories = CategoryBrowser.searchCategories;

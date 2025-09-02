/**
 * Pattern Detection Engine
 * Identifies complex usage patterns in queries like streams, transactions, clustering, caching, etc.
 */

export interface DetectedPattern {
  type: string;
  confidence: number;
  complexity: "simple" | "intermediate" | "advanced";
  relatedCommands: string[];
  useCases: string[];
  implementation: string;
  bestPractices: string[];
  commonPitfalls: string[];
}

export interface PatternDefinition {
  name: string;
  keywords: string[];
  phrases: RegExp[];
  relatedCommands: string[];
  complexity: "simple" | "intermediate" | "advanced";
  useCases: string[];
  implementation: string;
  bestPractices: string[];
  commonPitfalls: string[];
  alternatives: string[];
}

export class PatternMatcher {
  private static patterns: Map<string, PatternDefinition> = new Map();

  static {
    this.initializePatterns();
  }

  /**
   * Initialize comprehensive pattern definitions
   */
  private static initializePatterns(): void {
    // Caching Pattern
    this.addPattern({
      name: "caching",
      keywords: [
        "cache",
        "caching",
        "ttl",
        "expire",
        "temporary",
        "session",
        "fast",
        "performance",
      ],
      phrases: [
        /\bcache\s+data\b/i,
        /\btemporary\s+storage\b/i,
        /\bfast\s+access\b/i,
        /\bstore\s+temporarily\b/i,
        /\bsession\s+data\b/i,
        /\bperformance\s+optimization\b/i,
      ],
      relatedCommands: ["GET", "SET", "SETEX", "EXPIRE", "TTL", "DEL"],
      complexity: "simple",
      useCases: [
        "API response caching",
        "Session storage",
        "Temporary data storage",
        "Performance optimization",
        "Database query caching",
      ],
      implementation:
        "Use SET with expiration or SETEX for time-limited data storage",
      bestPractices: [
        "Set appropriate TTL values",
        "Use consistent key naming conventions",
        "Handle cache misses gracefully",
        "Monitor cache hit rates",
        "Consider cache warming strategies",
      ],
      commonPitfalls: [
        "Not setting expiration times",
        "Cache stampede effects",
        "Storing too large values",
        "Not handling cache invalidation",
      ],
      alternatives: ["Redis Modules", "External caching systems"],
    });

    // Streams Pattern
    this.addPattern({
      name: "streams",
      keywords: [
        "stream",
        "event",
        "log",
        "producer",
        "consumer",
        "real-time",
        "timeline",
        "append",
      ],
      phrases: [
        /\bevent\s+streaming\b/i,
        /\breal[\s-]?time\s+processing\b/i,
        /\bdata\s+stream\b/i,
        /\bproducer[\s\/]consumer\b/i,
        /\bevent\s+log\b/i,
        /\bmessage\s+stream\b/i,
        /\btimeline\s+data\b/i,
        /\bappend[\s-]?only\b/i,
      ],
      relatedCommands: [
        "XADD",
        "XREAD",
        "XREADGROUP",
        "XGROUP",
        "XLEN",
        "XTRIM",
        "XRANGE",
      ],
      complexity: "intermediate",
      useCases: [
        "Event sourcing",
        "Real-time analytics",
        "Audit logging",
        "Message processing",
        "Activity feeds",
        "IoT data collection",
      ],
      implementation:
        "Use XADD to append events, XREAD/XREADGROUP for consumption",
      bestPractices: [
        "Use consumer groups for parallel processing",
        "Implement proper acknowledgment handling",
        "Set up stream trimming policies",
        "Handle consumer failures gracefully",
        "Monitor stream length and consumer lag",
      ],
      commonPitfalls: [
        "Not trimming streams leading to memory issues",
        "Poor consumer group management",
        "Not handling duplicate messages",
        "Ignoring consumer failure scenarios",
      ],
      alternatives: ["Apache Kafka", "Apache Pulsar", "AWS Kinesis"],
    });

    // Transactions Pattern
    this.addPattern({
      name: "transactions",
      keywords: [
        "transaction",
        "atomic",
        "multi",
        "exec",
        "batch",
        "consistency",
        "rollback",
      ],
      phrases: [
        /\batomic\s+operations?\b/i,
        /\btransaction\s+processing\b/i,
        /\bbatch\s+operations?\b/i,
        /\ball[\s-]?or[\s-]?nothing\b/i,
        /\bconsistency\s+guarantee\b/i,
        /\bmulti[\s-]?step\s+operation\b/i,
      ],
      relatedCommands: ["MULTI", "EXEC", "DISCARD", "WATCH", "UNWATCH"],
      complexity: "intermediate",
      useCases: [
        "Financial transactions",
        "Inventory management",
        "User account operations",
        "Multi-step workflows",
        "Data consistency requirements",
      ],
      implementation:
        "Use MULTI/EXEC blocks with optional WATCH for optimistic locking",
      bestPractices: [
        "Keep transactions short and simple",
        "Use WATCH for optimistic concurrency control",
        "Handle transaction failures appropriately",
        "Avoid network calls within transactions",
        "Consider using Lua scripts for complex logic",
      ],
      commonPitfalls: [
        "Long-running transactions",
        "Not handling EXEC returning null",
        "Nested transaction attempts",
        "Forgetting to call EXEC",
      ],
      alternatives: ["Lua scripts", "Application-level transactions"],
    });

    // Distributed Locking Pattern
    this.addPattern({
      name: "locking",
      keywords: [
        "lock",
        "mutex",
        "semaphore",
        "distributed",
        "concurrency",
        "synchronization",
        "critical",
      ],
      phrases: [
        /\bdistributed\s+lock\b/i,
        /\bmutual\s+exclusion\b/i,
        /\bcritical\s+section\b/i,
        /\bconcurrency\s+control\b/i,
        /\bresource\s+locking\b/i,
        /\bsynchronization\s+primitive\b/i,
      ],
      relatedCommands: ["SET", "DEL", "EXPIRE", "SETNX", "EVAL"],
      complexity: "advanced",
      useCases: [
        "Resource coordination",
        "Preventing race conditions",
        "Exclusive access control",
        "Distributed system synchronization",
        "Job processing coordination",
      ],
      implementation:
        "Use SET with NX and EX options, or Lua scripts for reliable locking",
      bestPractices: [
        "Always set expiration times",
        "Use unique identifiers for lock values",
        "Implement proper lock release mechanisms",
        "Handle lock acquisition timeouts",
        "Consider lock renewal for long operations",
      ],
      commonPitfalls: [
        "Deadlocks from not setting expiration",
        "Lock stealing by other processes",
        "Not handling lock renewal",
        "Poor error handling on lock failures",
      ],
      alternatives: ["ZooKeeper", "etcd", "Consul"],
    });

    // Rate Limiting Pattern
    this.addPattern({
      name: "rate-limiting",
      keywords: [
        "rate",
        "limit",
        "throttle",
        "quota",
        "bucket",
        "window",
        "requests",
        "api",
      ],
      phrases: [
        /\brate\s+limit\b/i,
        /\bthrottling\s+requests\b/i,
        /\bapi\s+quota\b/i,
        /\btoken\s+bucket\b/i,
        /\bsliding\s+window\b/i,
        /\brequest\s+limiting\b/i,
      ],
      relatedCommands: [
        "INCR",
        "EXPIRE",
        "TTL",
        "EVAL",
        "ZADD",
        "ZREMRANGEBYSCORE",
      ],
      complexity: "advanced",
      useCases: [
        "API rate limiting",
        "User quota management",
        "DDoS protection",
        "Resource usage control",
        "Fair usage policies",
      ],
      implementation:
        "Use sliding window counters or token bucket algorithms with Redis",
      bestPractices: [
        "Choose appropriate window sizes",
        "Handle burst traffic gracefully",
        "Provide clear error messages",
        "Monitor rate limit effectiveness",
        "Consider different limits for different users",
      ],
      commonPitfalls: [
        "Clock synchronization issues",
        "Memory leaks from old counters",
        "Poor performance with many keys",
        "Not handling distributed scenarios",
      ],
      alternatives: [
        "API gateways",
        "Load balancers",
        "Specialized rate limiting services",
      ],
    });

    // Clustering Pattern
    this.addPattern({
      name: "clustering",
      keywords: [
        "cluster",
        "shard",
        "partition",
        "scale",
        "distributed",
        "horizontal",
        "nodes",
      ],
      phrases: [
        /\bredis\s+cluster\b/i,
        /\bhorizontal\s+scaling\b/i,
        /\bdata\s+partitioning\b/i,
        /\bsharding\s+strategy\b/i,
        /\bdistributed\s+storage\b/i,
        /\bmulti[\s-]?node\s+setup\b/i,
      ],
      relatedCommands: ["CLUSTER", "HASH_SLOT", "MIGRATE", "ASK", "MOVED"],
      complexity: "advanced",
      useCases: [
        "High availability systems",
        "Large-scale data storage",
        "Performance scaling",
        "Geographic distribution",
        "Load distribution",
      ],
      implementation: "Use GlideClusterClient for automatic cluster management",
      bestPractices: [
        "Design hash slot distribution carefully",
        "Handle cluster topology changes",
        "Implement proper error handling for redirections",
        "Monitor cluster health continuously",
        "Plan for cluster maintenance windows",
      ],
      commonPitfalls: [
        "Hot spots in data distribution",
        "Not handling cluster redirections",
        "Poor key design affecting distribution",
        "Network partition handling issues",
      ],
      alternatives: [
        "Redis Sentinel",
        "External sharding",
        "Database sharding",
      ],
    });

    // Pub/Sub Pattern
    this.addPattern({
      name: "pubsub",
      keywords: [
        "publish",
        "subscribe",
        "channel",
        "message",
        "notification",
        "broadcast",
        "real-time",
      ],
      phrases: [
        /\bpublish[\s\/]subscribe\b/i,
        /\bmessage\s+broadcasting\b/i,
        /\breal[\s-]?time\s+notifications\b/i,
        /\bevent\s+broadcasting\b/i,
        /\bchannel\s+communication\b/i,
        /\bmessaging\s+system\b/i,
      ],
      relatedCommands: [
        "PUBLISH",
        "SUBSCRIBE",
        "PSUBSCRIBE",
        "UNSUBSCRIBE",
        "PUBSUB",
      ],
      complexity: "intermediate",
      useCases: [
        "Real-time notifications",
        "Live updates",
        "Chat applications",
        "Event broadcasting",
        "System monitoring alerts",
      ],
      implementation:
        "Use dedicated subscriber clients with PUBLISH/SUBSCRIBE commands",
      bestPractices: [
        "Use dedicated connections for subscribers",
        "Handle connection failures gracefully",
        "Implement message acknowledgment if needed",
        "Monitor subscriber count and message delivery",
        "Consider message persistence requirements",
      ],
      commonPitfalls: [
        "Message loss during disconnections",
        "Blocking subscriber connections",
        "Not handling subscription failures",
        "Memory issues with many subscribers",
      ],
      alternatives: ["Message queues", "WebSockets", "Server-Sent Events"],
    });

    // Geospatial Pattern
    this.addPattern({
      name: "geospatial",
      keywords: [
        "geo",
        "location",
        "coordinate",
        "latitude",
        "longitude",
        "distance",
        "radius",
        "nearby",
      ],
      phrases: [
        /\blocation\s+based\b/i,
        /\bgeospatial\s+queries\b/i,
        /\bproximity\s+search\b/i,
        /\bnearby\s+locations\b/i,
        /\bdistance\s+calculation\b/i,
        /\bmap\s+data\b/i,
      ],
      relatedCommands: ["GEOADD", "GEODIST", "GEORADIUS", "GEOHASH", "GEOPOS"],
      complexity: "intermediate",
      useCases: [
        "Location-based services",
        "Proximity search",
        "Geofencing",
        "Delivery routing",
        "Store locators",
      ],
      implementation: "Use GEO commands for storing and querying location data",
      bestPractices: [
        "Validate coordinate inputs",
        "Consider earth curvature in distance calculations",
        "Use appropriate units for distance queries",
        "Index locations efficiently",
        "Handle edge cases at poles and date line",
      ],
      commonPitfalls: [
        "Invalid coordinate ranges",
        "Precision issues with coordinates",
        "Performance problems with large datasets",
        "Not considering earth geometry",
      ],
      alternatives: ["PostGIS", "Elasticsearch", "MongoDB geospatial"],
    });

    // Session Store Pattern
    this.addPattern({
      name: "session-store",
      keywords: [
        "session",
        "user",
        "login",
        "authentication",
        "state",
        "cookie",
        "token",
      ],
      phrases: [
        /\bsession\s+storage\b/i,
        /\buser\s+sessions\b/i,
        /\bauthentication\s+state\b/i,
        /\blogin\s+tracking\b/i,
        /\bsession\s+management\b/i,
        /\bstateful\s+applications\b/i,
      ],
      relatedCommands: ["SET", "GET", "EXPIRE", "DEL", "HSET", "HGET"],
      complexity: "simple",
      useCases: [
        "Web application sessions",
        "User authentication state",
        "Shopping cart persistence",
        "Temporary user data",
        "Login session tracking",
      ],
      implementation:
        "Store session data with expiration using SET/HSET commands",
      bestPractices: [
        "Set appropriate session timeouts",
        "Use secure session identifiers",
        "Implement session renewal mechanisms",
        "Handle concurrent session access",
        "Provide session cleanup procedures",
      ],
      commonPitfalls: [
        "Session fixation vulnerabilities",
        "Not expiring old sessions",
        "Storing sensitive data in sessions",
        "Poor session key generation",
      ],
      alternatives: ["Database sessions", "JWT tokens", "Server-side sessions"],
    });

    // Leaderboard Pattern
    this.addPattern({
      name: "leaderboard",
      keywords: [
        "leaderboard",
        "ranking",
        "score",
        "top",
        "best",
        "competition",
        "game",
        "points",
      ],
      phrases: [
        /\bleaderboard\s+system\b/i,
        /\branking\s+system\b/i,
        /\btop\s+scores\b/i,
        /\bcompetition\s+ranking\b/i,
        /\bgame\s+scores\b/i,
        /\buser\s+ranking\b/i,
      ],
      relatedCommands: [
        "ZADD",
        "ZRANGE",
        "ZREVRANGE",
        "ZRANK",
        "ZSCORE",
        "ZREM",
      ],
      complexity: "simple",
      useCases: [
        "Game leaderboards",
        "User rankings",
        "Competition systems",
        "Performance metrics",
        "Activity scoring",
      ],
      implementation:
        "Use sorted sets (ZADD/ZRANGE) for efficient ranking operations",
      bestPractices: [
        "Use consistent scoring systems",
        "Handle tie-breaking scenarios",
        "Implement efficient pagination",
        "Consider historical ranking data",
        "Optimize for common query patterns",
      ],
      commonPitfalls: [
        "Score overflow issues",
        "Poor handling of tied scores",
        "Inefficient range queries",
        "Not handling user removals",
      ],
      alternatives: ["Database ranking", "External ranking services"],
    });
  }

  /**
   * Add a pattern definition to the matcher
   */
  private static addPattern(pattern: PatternDefinition): void {
    this.patterns.set(pattern.name, pattern);
  }

  /**
   * Detect patterns in a query
   */
  static detectPatterns(query: string): DetectedPattern[] {
    const detectedPatterns: DetectedPattern[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [patternName, pattern] of this.patterns) {
      const confidence = this.calculatePatternConfidence(query, pattern);

      if (confidence > 0.3) {
        // Minimum confidence threshold
        detectedPatterns.push({
          type: patternName,
          confidence,
          complexity: pattern.complexity,
          relatedCommands: pattern.relatedCommands,
          useCases: pattern.useCases,
          implementation: pattern.implementation,
          bestPractices: pattern.bestPractices,
          commonPitfalls: pattern.commonPitfalls,
        });
      }
    }

    // Sort by confidence and return top results
    return detectedPatterns
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Limit to top 3 patterns
  }

  /**
   * Calculate confidence score for pattern matching
   */
  private static calculatePatternConfidence(
    query: string,
    pattern: PatternDefinition,
  ): number {
    const lowerQuery = query.toLowerCase();
    let score = 0;

    // Check keyword matches
    const keywordMatches = pattern.keywords.filter((keyword) =>
      lowerQuery.includes(keyword.toLowerCase()),
    ).length;
    const keywordScore = keywordMatches / pattern.keywords.length;

    // Check phrase matches
    const phraseMatches = pattern.phrases.filter((phrase) =>
      phrase.test(query),
    ).length;
    const phraseScore = phraseMatches > 0 ? 0.5 : 0;

    // Check use case mentions
    const useCaseMatches = pattern.useCases.filter((useCase) =>
      lowerQuery.includes(useCase.toLowerCase()),
    ).length;
    const useCaseScore = useCaseMatches > 0 ? 0.3 : 0;

    // Combine scores with weights
    score = keywordScore * 0.5 + phraseScore * 0.3 + useCaseScore * 0.2;

    // Boost for exact pattern name mention
    if (lowerQuery.includes(pattern.name)) {
      score = Math.min(score + 0.4, 1.0);
    }

    return score;
  }

  /**
   * Get pattern definition by name
   */
  static getPattern(patternName: string): PatternDefinition | undefined {
    return this.patterns.get(patternName);
  }

  /**
   * Get all available patterns
   */
  static getAllPatterns(): PatternDefinition[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get patterns by complexity level
   */
  static getPatternsByComplexity(
    complexity: "simple" | "intermediate" | "advanced",
  ): PatternDefinition[] {
    return Array.from(this.patterns.values()).filter(
      (pattern) => pattern.complexity === complexity,
    );
  }

  /**
   * Get related patterns for a given pattern
   */
  static getRelatedPatterns(patternName: string): PatternDefinition[] {
    const pattern = this.patterns.get(patternName);
    if (!pattern) return [];

    const related: PatternDefinition[] = [];

    // Find patterns with overlapping commands
    for (const [name, otherPattern] of this.patterns) {
      if (name === patternName) continue;

      const commonCommands = pattern.relatedCommands.filter((cmd) =>
        otherPattern.relatedCommands.includes(cmd),
      );

      if (commonCommands.length > 0) {
        related.push(otherPattern);
      }
    }

    // Sort by number of common commands
    return related
      .sort((a, b) => {
        const aCommon = pattern.relatedCommands.filter((cmd) =>
          a.relatedCommands.includes(cmd),
        ).length;
        const bCommon = pattern.relatedCommands.filter((cmd) =>
          b.relatedCommands.includes(cmd),
        ).length;
        return bCommon - aCommon;
      })
      .slice(0, 3);
  }

  /**
   * Suggest patterns based on detected commands
   */
  static suggestPatternsForCommands(commands: string[]): PatternDefinition[] {
    const suggestions: Array<{ pattern: PatternDefinition; score: number }> =
      [];

    for (const [name, pattern] of this.patterns) {
      const matchingCommands = commands.filter((cmd) =>
        pattern.relatedCommands.includes(cmd.toUpperCase()),
      );

      if (matchingCommands.length > 0) {
        const score = matchingCommands.length / pattern.relatedCommands.length;
        suggestions.push({ pattern, score });
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.pattern);
  }

  /**
   * Get implementation guidance for a pattern
   */
  static getImplementationGuidance(patternName: string): {
    implementation: string;
    bestPractices: string[];
    commonPitfalls: string[];
    relatedCommands: string[];
  } | null {
    const pattern = this.patterns.get(patternName);
    if (!pattern) return null;

    return {
      implementation: pattern.implementation,
      bestPractices: pattern.bestPractices,
      commonPitfalls: pattern.commonPitfalls,
      relatedCommands: pattern.relatedCommands,
    };
  }
}

// Export convenience functions
export const detectPatterns = PatternMatcher.detectPatterns;
export const getPattern = PatternMatcher.getPattern;
export const suggestPatternsForCommands =
  PatternMatcher.suggestPatternsForCommands;

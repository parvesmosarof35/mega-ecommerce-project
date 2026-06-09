import config from "../config";

interface CacheEntry {
  value: any;
  expiresAt: number;
}

class CacheHelperClass {
  private cacheMap = new Map<string, CacheEntry>();
  // Maps tags (e.g. "products") to a Set of cache keys that belong to that tag
  private tagMap = new Map<string, Set<string>>();

  // Monitoring stats
  private hits = 0;
  private misses = 0;
  private invalidations = 0;

  /**
   * Generates a normalized cache key based on prefix and query parameters
   */
  public generateKey(prefix: string, query?: any): string {
    if (!query) {
      return prefix;
    }

    // Sort query keys to ensure deterministic ordering
    const sortedKeys = Object.keys(query).sort();
    const queryParts = sortedKeys.map((key) => {
      const val = query[key];
      if (typeof val === "object" && val !== null) {
        return `${key}=${JSON.stringify(val)}`;
      }
      return `${key}=${val}`;
    });

    return queryParts.length > 0 
      ? `${prefix}:${queryParts.join("&")}`
      : prefix;
  }

  /**
   * Retrieves a value from cache. Returns null if missing or expired.
   */
  public get(key: string): any {
    if (!config.cache_enabled) {
      return null;
    }

    const entry = this.cacheMap.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cacheMap.delete(key);
      // Clean up key from tag sets
      this.removeKeyFromTags(key);
      this.misses++;
      return null;
    }

    this.hits++;
    // Return a deep copy of the value to prevent reference mutation
    return typeof entry.value === "object" && entry.value !== null
      ? JSON.parse(JSON.stringify(entry.value))
      : entry.value;
  }

  /**
   * Saves a value into cache, associated with tags.
   */
  public set(
    key: string,
    value: any,
    tags: string[] = [],
    ttlSeconds?: number
  ): void {
    if (!config.cache_enabled) {
      return;
    }

    const ttl = ttlSeconds !== undefined ? ttlSeconds : config.cache_ttl;
    const expiresAt = Date.now() + ttl * 1000;

    // Deep clone the object if it's not a primitive, to avoid mutating cached references
    const cachedValue =
      typeof value === "object" && value !== null
        ? JSON.parse(JSON.stringify(value))
        : value;

    this.cacheMap.set(key, { value: cachedValue, expiresAt });

    // Track key in tags
    for (const tag of tags) {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set<string>());
      }
      this.tagMap.get(tag)!.add(key);
    }
  }

  /**
   * Invalidates all cache entries linked to the specified tags.
   */
  public invalidateTags(tags: string[]): void {
    if (!config.cache_enabled) {
      return;
    }

    for (const tag of tags) {
      const keys = this.tagMap.get(tag);
      if (keys) {
        for (const key of keys) {
          this.cacheMap.delete(key);
        }
        this.tagMap.delete(tag);
        this.invalidations++;
      }
    }
  }

  /**
   * Helper to remove a key from tag mapping sets
   */
  private removeKeyFromTags(key: string): void {
    for (const [tag, keys] of this.tagMap.entries()) {
      if (keys.has(key)) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagMap.delete(tag);
        }
      }
    }
  }

  /**
   * Retrieves current cache statistics
   */
  public getStats() {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    return {
      enabled: config.cache_enabled,
      cacheSize: this.cacheMap.size,
      trackedTags: this.tagMap.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate.toFixed(2)}%`,
      invalidations: this.invalidations,
    };
  }

  /**
   * Resets monitoring stats and clears cache (useful for testing)
   */
  public clearAll(): void {
    this.cacheMap.clear();
    this.tagMap.clear();
    this.hits = 0;
    this.misses = 0;
    this.invalidations = 0;
  }
}

export const CacheHelper = new CacheHelperClass();

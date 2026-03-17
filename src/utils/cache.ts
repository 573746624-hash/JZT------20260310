type CacheEntry<T> = {
  value: T;
  expiresAt: number | null;
};

class CacheManager {
  private store = new Map<string, CacheEntry<any>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses += 1;
      return null;
    }

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses += 1;
      return null;
    }

    this.hits += 1;
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt =
      typeof ttl === "number" && ttl > 0 ? Date.now() + ttl : null;
    this.store.set(key, { value, expiresAt });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  deletePattern(pattern: string): void {
    const keys = Array.from(this.store.keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) this.store.delete(key);
    });
  }

  clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  size(): number {
    return this.store.size;
  }

  getStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

export const cache = new CacheManager();

export function withCache<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: {
    keyGenerator: (...args: TArgs) => string;
    ttl?: number;
  },
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    const key = options.keyGenerator(...args);
    const cached = cache.get<TResult>(key);
    if (cached !== null) return cached;
    const result = await fn(...args);
    cache.set(key, result, options.ttl);
    return result;
  };
}


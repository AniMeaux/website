import type { Cache, CacheEntry } from "@epic-web/cachified";
import { totalTtl } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

export class ServiceCache implements Cache {
  private lruCache = new LRUCache<string, CacheEntry<unknown>>({ max: 10 });

  set(key: string, value: CacheEntry<any>) {
    const ttl = totalTtl(value?.metadata);

    return this.lruCache.set(key, value, {
      ttl: ttl === Infinity ? undefined : ttl,
      start: value?.metadata?.createdTime,
    });
  }

  get(key: string) {
    return this.lruCache.get(key);
  }

  delete(key: string) {
    return this.lruCache.delete(key);
  }
}

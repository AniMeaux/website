import { CacheEntry, lruCacheAdapter } from "cachified";
import { LRUCache } from "lru-cache";
import { singleton } from "~/core/singleton.server";

const lru = singleton(
  "lru-cache",
  () => new LRUCache<string, CacheEntry<unknown>>({ max: 10 })
);

export const lruCache = lruCacheAdapter(lru);

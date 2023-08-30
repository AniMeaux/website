import { singleton } from "@animeaux/core";
import type { CacheEntry } from "cachified";
import { lruCacheAdapter } from "cachified";
import { LRUCache } from "lru-cache";

const lru = singleton(
  "lru-cache",
  () => new LRUCache<string, CacheEntry<unknown>>({ max: 10 }),
);

export const lruCache = lruCacheAdapter(lru);

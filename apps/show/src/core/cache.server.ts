import { singleton } from "@animeaux/core";
import type { Cache, CacheEntry } from "@epic-web/cachified";
import { totalTtl } from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const lru = singleton(
  "lru-cache",
  () => new LRUCache<string, CacheEntry<unknown>>({ max: 10 }),
);

export const lruCache: Cache = {
  set(key, value) {
    const ttl = totalTtl(value?.metadata);

    return lru.set(key, value, {
      ttl: ttl === Infinity ? undefined : ttl,
      start: value?.metadata?.createdTime,
    });
  },

  get(key) {
    return lru.get(key);
  },

  delete(key) {
    return lru.delete(key);
  },
};

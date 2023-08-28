import type { Metadata } from "metascraper";
import metascraper from "metascraper";
import metascraperDate from "metascraper-date";
import metascraperImage from "metascraper-image";
import metascraperPublisher from "metascraper-publisher";
import metascraperTitle from "metascraper-title";

export async function scrapUrl(...args: Parameters<typeof scraper>) {
  const result = await scraper(...args);

  // Metascraper set every attribute as required but we can't be sure they all
  // exists.
  // And we also limit to the ones we need.
  return result as Partial<
    Pick<Metadata, "date" | "image" | "publisher" | "title">
  >;
}

const scraper = metascraper([
  metascraperDate(),
  metascraperImage(),
  metascraperPublisher(),
  metascraperTitle(),
]);

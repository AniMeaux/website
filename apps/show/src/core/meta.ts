import type { MetaDescriptor } from "@remix-run/react";

/**
 * @see https://metatags.io/
 * @see https://ogp.me/
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export function createSocialMeta({ title }: { title: string }) {
  const meta: MetaDescriptor[] = [
    { title },
    { property: "og:title", content: title },
    { property: "twitter:title", content: title },
  ];

  return meta;
}

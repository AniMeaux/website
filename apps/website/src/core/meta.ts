import { HtmlMetaDescriptor } from "@remix-run/react";

/**
 * @see https://metatags.io/
 * @see https://ogp.me/
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export function createSocialMeta({
  title,
  description,
  imageUrl,
}: {
  title?: string;
  description?: string;
  imageUrl?: string;
} = {}): HtmlMetaDescriptor {
  const meta: HtmlMetaDescriptor = {};

  if (title != null) {
    meta["title"] = title;
    meta["og:title"] = title;
    meta["twitter:title"] = title;
  }

  if (description != null) {
    meta["description"] = description;
    meta["og:description"] = description;
    meta["twitter:description"] = description;
  }

  if (imageUrl != null) {
    meta["og:image"] = imageUrl;
    meta["twitter:image"] = imageUrl;
  }

  return meta;
}

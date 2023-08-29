import type { V2_MetaDescriptor } from "@remix-run/react";

/**
 * @see https://metatags.io/
 * @see https://ogp.me/
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */
export function createSocialMeta(
  params: {
    title?: string;
    description?: string;
    imageUrl?: string;
  } & (
    | { type?: "website" }
    | {
        type: "article";
        publishedTime: string;
        author: string;
      }
  ) = {},
) {
  const { type = "website", title, description, imageUrl } = params;
  const meta: V2_MetaDescriptor[] = [{ property: "og:type", content: type }];

  if (title != null) {
    meta.push(
      { title },
      { property: "og:title", content: title },
      { property: "twitter:title", content: title },
    );
  }

  if (description != null) {
    meta.push(
      { name: "description", content: description },
      { property: "og:description", content: description },
      { property: "twitter:description", content: description },
    );
  }

  if (imageUrl != null) {
    meta.push(
      { property: "og:image", content: imageUrl },
      { property: "twitter:image", content: imageUrl },
    );
  }

  if (params.type === "article") {
    meta.push(
      { property: "article:published_time", content: params.publishedTime },
      { property: "article:author", content: params.author },
    );
  }

  return meta;
}

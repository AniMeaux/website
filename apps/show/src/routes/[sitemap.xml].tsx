import { createConfig } from "#/core/config.server";
import { renderToStaticMarkup } from "react-dom/server";

type SitemapAttribute = {
  key?: React.Key;
  children?: React.ReactNode;
};

// Override JSX interface so we can render XML with React \o/
declare global {
  namespace JSX {
    interface IntrinsicElements {
      urlset: SitemapAttribute & { xmlns: string };
      url: SitemapAttribute;
      loc: SitemapAttribute;
      changefreq: SitemapAttribute;
      priority: SitemapAttribute;
    }
  }
}

/**
 * @see https://www.sitemaps.org/protocol.html#xmlTagDefinitions
 */
type UrlDefinition = {
  /** Path relative to host. Must start with "/" (e.g. "/", "/adopt"). */
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";

  /** Number in range [0, 1] */
  priority?: number;
};

const urlDefinitions: UrlDefinition[] = [
  { path: "/", changeFrequency: "weekly" },
  { path: "/acces", changeFrequency: "weekly" },
  { path: "/exposants", changeFrequency: "weekly" },
  { path: "/faq", changeFrequency: "weekly" },
  { path: "/programme", changeFrequency: "weekly" },
];

export async function loader() {
  const config = createConfig();

  const markup = renderToStaticMarkup(
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      {urlDefinitions.map((url) => (
        <url key={url.path}>
          <loc>{`${config.publicHost}${url.path}`}</loc>
          <changefreq>{url.changeFrequency}</changefreq>
          {url.priority != null && <priority>{url.priority}</priority>}
        </url>
      ))}
    </urlset>
  );

  return new Response('<?xml version="1.0" encoding="UTF-8"?>' + markup, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

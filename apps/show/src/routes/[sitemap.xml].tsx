import { createConfig } from "#core/config.server.ts";
import { SORTED_SHOW_DAYS } from "#core/dates.ts";
import { Routes } from "#core/navigation.tsx";
import { SORTED_PREVIOUS_EDITIONS } from "#previousEditions/previousEdition.tsx";
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

export async function loader() {
  const { featureFlagSiteOnline, featureFlagShowProgram, publicHost } =
    createConfig();

  const urlDefinitions: UrlDefinition[] = [
    { path: Routes.home(), changeFrequency: "weekly" },
  ];

  if (featureFlagSiteOnline) {
    urlDefinitions.push(
      { path: Routes.exhibitors(), changeFrequency: "weekly" },
      { path: Routes.access(), changeFrequency: "weekly" },
      { path: Routes.faq(), changeFrequency: "weekly" },
    );

    SORTED_PREVIOUS_EDITIONS.forEach((edition) => {
      urlDefinitions.push({
        path: Routes.previousEditions(edition),
        changeFrequency: "monthly",
      });
    });

    if (featureFlagShowProgram) {
      SORTED_SHOW_DAYS.forEach((day) => {
        urlDefinitions.push({
          path: Routes.program(day),
          changeFrequency: "weekly",
        });
      });
    } else {
      urlDefinitions.push({
        path: Routes.program(),
        changeFrequency: "weekly",
      });
    }
  }

  const markup = renderToStaticMarkup(
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      {urlDefinitions.map((url) => (
        <url key={url.path}>
          <loc>{`${publicHost}${url.path}`}</loc>
          <changefreq>{url.changeFrequency}</changefreq>
          {url.priority != null && <priority>{url.priority}</priority>}
        </url>
      ))}
    </urlset>,
  );

  return new Response('<?xml version="1.0" encoding="UTF-8"?>' + markup, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

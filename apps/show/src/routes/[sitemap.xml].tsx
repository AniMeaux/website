import { SORTED_SHOW_DAYS } from "#core/dates";
import { Routes } from "#core/navigation";
import { SORTED_PREVIOUS_EDITIONS } from "#previous-editions/previous-edition";
import { renderToStaticMarkup } from "react-dom/server";

export async function loader() {
  const urlDefinitions: UrlDefinition[] = [
    { path: Routes.home.toString(), changeFrequency: "weekly" },
  ];

  SORTED_PREVIOUS_EDITIONS.forEach((edition) => {
    urlDefinitions.push({
      path: Routes.previousEditions.edition(edition).toString(),
      changeFrequency: "monthly",
    });
  });

  if (process.env.FEATURE_FLAG_SITE_ONLINE === "true") {
    urlDefinitions.push(
      { path: Routes.exhibitors.toString(), changeFrequency: "weekly" },
      { path: Routes.access.toString(), changeFrequency: "weekly" },
      { path: Routes.faq.toString(), changeFrequency: "weekly" },
    );

    if (process.env.FEATURE_FLAG_SHOW_PROGRAM === "true") {
      SORTED_SHOW_DAYS.forEach((day) => {
        urlDefinitions.push({
          path: Routes.program.day(day).toString(),
          changeFrequency: "weekly",
        });
      });
    } else {
      urlDefinitions.push({
        path: Routes.program.toString(),
        changeFrequency: "weekly",
      });
    }
  }

  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE === "true") {
    urlDefinitions.push({
      path: Routes.exhibitorApplication.toString(),
      changeFrequency: "weekly",
    });
  }

  const markup = renderToStaticMarkup(
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      {urlDefinitions.map((url) => (
        <url key={url.path}>
          <loc>{`${process.env.PUBLIC_HOST}${url.path}`}</loc>
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

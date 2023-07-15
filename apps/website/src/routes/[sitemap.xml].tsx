import { Species } from "@prisma/client";
import { renderToStaticMarkup } from "react-dom/server";
import { createConfig } from "~/core/config.server";
import { SPECIES_TO_PATH } from "~/core/controllers/searchForm";

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
  { path: "/abandonner-votre-animal", changeFrequency: "monthly" },
  { path: "/adoption", changeFrequency: "weekly" },
  { path: "/articles-de-presse", changeFrequency: "monthly" },
  { path: "/blog", changeFrequency: "monthly" },
  { path: "/conditions-d-adoption", changeFrequency: "monthly" },
  { path: "/devenir-benevole", changeFrequency: "monthly" },
  { path: "/devenir-famille-d-accueil", changeFrequency: "monthly" },
  { path: "/evenements", changeFrequency: "weekly" },
  { path: "/evenements/passes", changeFrequency: "weekly" },
  { path: "/faire-un-don", changeFrequency: "monthly" },
  { path: "/faq", changeFrequency: "monthly" },
  { path: "/informer-d-un-acte-de-maltraitance", changeFrequency: "monthly" },
  { path: "/mentions-legales", changeFrequency: "monthly" },
  { path: "/nommez-votre-animal", changeFrequency: "weekly" },
  { path: "/partenaires", changeFrequency: "monthly" },
  { path: "/sauves", changeFrequency: "weekly" },
  { path: "/signaler-un-animal-errant", changeFrequency: "monthly" },
];

Object.values(Species).forEach((species) => {
  urlDefinitions.push({
    path: `/adoption/${SPECIES_TO_PATH[species]}`,
    changeFrequency: "weekly",
  });
});

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

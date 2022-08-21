import { LoaderFunction } from "@remix-run/node";
import { createConfig } from "~/core/config.server";

export const loader: LoaderFunction = () => {
  const config = createConfig();
  return new Response(`Sitemap: ${config.publicHost}/sitemap.xml`);
};

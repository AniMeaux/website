import { createConfig } from "#core/config.server.ts";

export async function loader() {
  const config = createConfig();
  return new Response(`Sitemap: ${config.publicHost}/sitemap.xml`);
}

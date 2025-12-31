import { createConfig } from "#i/core/config.server";

export async function loader() {
  const config = createConfig();
  return new Response(`Sitemap: ${config.publicHost}/sitemap.xml`);
}

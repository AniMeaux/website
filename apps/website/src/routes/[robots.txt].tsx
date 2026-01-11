export async function loader() {
  return new Response(`Sitemap: ${process.env.PUBLIC_HOST}/sitemap.xml`);
}

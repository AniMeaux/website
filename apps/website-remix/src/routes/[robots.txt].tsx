import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return new Response(`Sitemap: ${process.env.PUBLIC_HOST ?? ""}/sitemap.xml`);
};

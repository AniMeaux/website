import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { getPageTitle } from "~/core/pageTitle";
import { ErrorPage } from "~/dataDisplay/errorPage";

export const loader: LoaderFunction = async () => {
  return new Response("Not found", { status: 404 });
};

export const meta: MetaFunction = () => {
  return {
    title: getPageTitle("Page introuvable"),
  };
};

/**
 * By using a splat route we can still use the root's loader data in a 404 page.
 * Other error pages (500) will be displayed by a degraded error page.
 *
 * @see https://remix.run/docs/en/v1/guides/routing#splats
 */
export default function NotFoundPage() {
  return <ErrorPage status={404} />;
}

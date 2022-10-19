import { MetaFunction } from "@remix-run/node";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { getPageTitle } from "~/core/pageTitle";

export async function loader() {
  return new Response("Not found", { status: 404 });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle(getErrorTitle(404)) };
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

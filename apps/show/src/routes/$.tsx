import { V2_MetaFunction } from "@remix-run/react";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
};

/**
 * By using a splat route we can still use the root's loader data in a 404 page.
 * Other error pages (500) will be displayed by a degraded error page.
 *
 * @see https://remix.run/docs/en/v1/guides/routing#splats
 */
export function ErrorBoundary() {
  return <ErrorPage isStandAlone />;
}

export default function Route() {
  return null;
}

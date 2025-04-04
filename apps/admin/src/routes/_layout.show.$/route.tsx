import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import type { MetaFunction } from "@remix-run/node";

export async function loader() {
  throw notFound();
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle(getErrorTitle(404)) }];
};

/**
 * By using a splat route we can still use the root's loader data in a 404 page.
 * Other error pages (500) will be displayed by a degraded error page.
 *
 * @see https://remix.run/docs/en/v1/guides/routing#splats
 */
export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  return null;
}

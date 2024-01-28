import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/pageTitle";
import { NotFoundResponse } from "#core/response.server";
import type { MetaFunction } from "@remix-run/node";

export async function loader() {
  throw new NotFoundResponse();
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
    <PageLayout>
      <PageLayout.Content className="flex flex-col">
        <ErrorPage />
      </PageLayout.Content>
    </PageLayout>
  );
}

export default function Route() {
  return null;
}

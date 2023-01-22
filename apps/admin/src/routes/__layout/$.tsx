import { MetaFunction } from "@remix-run/node";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { PageContent, PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";

export async function loader() {
  return new NotFoundResponse();
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
export default function Route() {
  return (
    <PageLayout>
      <PageContent className="flex flex-col">
        <ErrorPage status={404} />
      </PageContent>
    </PageLayout>
  );
}

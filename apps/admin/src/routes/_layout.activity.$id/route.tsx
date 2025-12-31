import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js";
import { PageLayout } from "#i/core/layout/page.js";
import { getPageTitle } from "#i/core/page-title.js";
import type { MetaFunction } from "@remix-run/node";
import { DateTime } from "luxon";
import { CardDetails } from "./card-details";
import { CardDiff } from "./card-diff";
import { Header } from "./header";
import type { loader } from "./loader.server";

export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.activity.createdAt != null
          ? `Activité du ${DateTime.fromISO(data.activity.createdAt).toLocaleString(DateTime.DATETIME_MED)}`
          : getErrorTitle(404),
      ),
    },
  ];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Root>
      <PageLayout.Content className="grid grid-cols-1">
        <ErrorPage />
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

export default function Route() {
  return (
    <PageLayout.Root>
      <Header />

      <PageLayout.Content className="grid grid-cols-1 gap-1 md:gap-2">
        <CardDetails />
        <CardDiff />
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

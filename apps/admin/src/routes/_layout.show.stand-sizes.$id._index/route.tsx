import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation.js";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { CardApplicationList } from "./card-application-list";
import { CardDetails } from "./card-details";
import { CardExhibitorList } from "./card-exhibitor-list";
import { CardPrices } from "./card-prices";
import { CardSituation } from "./card-situation";
import type { loader } from "./loader.server";

export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getPageTitle(data?.standSize.label ?? getErrorTitle(404)) }];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  return (
    <>
      <Header />

      <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <div className="grid grid-cols-1 gap-1 md:col-start-2 md:row-start-1 md:gap-2">
          <CardSituation />
          <CardDetails />
          <CardPrices />
        </div>

        <div className="grid grid-cols-1 gap-1 md:gap-2">
          <CardExhibitorList />
          <CardApplicationList />
        </div>
      </PageLayout.Content>
    </>
  );
}

export function Header() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root className="grid grid-cols-2-auto justify-between gap-2 md:gap-4">
      <PageLayout.Header.Title>{standSize.label}</PageLayout.Header.Title>

      <Action variant="text" asChild>
        <BaseLink to={Routes.show.standSizes.id(standSize.id).edit.toString()}>
          Modifier
        </BaseLink>
      </Action>
    </PageLayout.Header.Root>
  );
}

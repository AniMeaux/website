import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { CardDescription } from "./card-description";
import { CardDocuments } from "./card-documents";
import { CardDogsConfiguration } from "./card-dogs-configuration";
import { CardInvoices } from "./card-invoices";
import { CardOnStandAnimations } from "./card-on-stand-animations";
import { CardProfile } from "./card-profile";
import { CardSituation } from "./card-situation";
import { CardStandConfiguration } from "./card-stand-configuration";
import { CardStructure } from "./card-structure";
import type { loader } from "./loader.server";

export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getPageTitle(data?.exhibitor.name ?? getErrorTitle(404)) }];
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
          <CardProfile />
          <CardStructure />
        </div>

        <div className="grid grid-cols-1 gap-1 md:gap-2">
          <CardDescription />
          <CardStandConfiguration />
          <CardDogsConfiguration />
          <CardDocuments />
          <CardInvoices />
          <CardOnStandAnimations />
        </div>
      </PageLayout.Content>
    </>
  );
}

function Header() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root>
      <PageLayout.Header.Title>{exhibitor.name}</PageLayout.Header.Title>
    </PageLayout.Header.Root>
  );
}

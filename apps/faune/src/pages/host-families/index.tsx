import {
  Header,
  HostFamilyItem,
  HostFamilyItemPlaceholder,
  useAllHostFamilies,
} from "@animeaux/app-core";
import { HostFamily, PaginatedResponse } from "@animeaux/shared-entities";
import {
  EmptyMessage,
  Main,
  Placeholders,
  Section,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { PageTitle } from "../../core/pageTitle";

function LoadingRows() {
  return (
    <Section>
      <ul>
        <Placeholders count={5}>
          <li>
            <HostFamilyItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

type HostFamiliesRowsProps = {
  hostFamiliesPages: PaginatedResponse<HostFamily>[];
  hasNextPage: boolean;
};

function HostFamiliesRows({
  hostFamiliesPages,
  hasNextPage,
}: HostFamiliesRowsProps) {
  // There is allways at least one page.
  if (hostFamiliesPages[0].hits.length === 0) {
    return (
      <EmptyMessage>Il n'y a pas encore de famille d'accueil.</EmptyMessage>
    );
  }

  const children: React.ReactNode[] = [];

  hostFamiliesPages.forEach((page) => {
    page.hits.forEach((hostFamily) => {
      children.push(
        <li key={hostFamily.id}>
          <HostFamilyItem hostFamily={hostFamily} href={`./${hostFamily.id}`} />
        </li>
      );
    });
  });

  return (
    <Section>
      <ul>
        {children}

        {hasNextPage && (
          <li>
            <HostFamilyItemPlaceholder />
          </li>
        )}
      </ul>
    </Section>
  );
}

export default function HostFamilyListPage() {
  const [hostFamiliesPages, query] = useAllHostFamilies();

  let content: React.ReactNode | null = null;
  let hostFamiliesCount: string = "";

  if (hostFamiliesPages != null) {
    // There is allways at least one page.
    hostFamiliesCount = `(${hostFamiliesPages.pages[0].hitsTotalCount})`;
    content = (
      <HostFamiliesRows
        hostFamiliesPages={hostFamiliesPages.pages}
        // Use `hasNextPage` instead of `isFetchingNextPage` to avoid changing
        // the page height during a scroll when the placeholder is rendered.
        // This is ok because the placeholder will only be visible when the
        // scroll is in a fetch more position.
        hasNextPage={query.hasNextPage ?? false}
      />
    );
  } else if (query.isLoading) {
    content = <LoadingRows />;
  }

  return (
    <div>
      <PageTitle title="Familles d'accueil" />

      <Header
        headerTitle={`Familles d'accueil ${hostFamiliesCount}`}
        action={{
          href: "./new",
          icon: FaPlus,
          label: "Créer une FA",
        }}
      />

      <Main>{content}</Main>
    </div>
  );
}

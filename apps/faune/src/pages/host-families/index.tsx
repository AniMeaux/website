import {
  Header,
  SearchableHostFamilyItem,
  SearchableHostFamilyItemPlaceholder,
  useAllHostFamilies,
} from "@animeaux/app-core";
import {
  PaginatedResponse,
  SearchableHostFamily,
} from "@animeaux/shared-entities";
import {
  Button,
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
            <SearchableHostFamilyItemPlaceholder />
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

type HostFamiliesRowsProps = {
  hostFamiliesPages: PaginatedResponse<SearchableHostFamily>[];
};

function HostFamiliesRows({ hostFamiliesPages }: HostFamiliesRowsProps) {
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
          <SearchableHostFamilyItem
            hostFamily={hostFamily}
            href={`./${hostFamily.id}`}
          />
        </li>
      );
    });
  });

  return (
    <Section>
      <ul>{children}</ul>
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
    content = <HostFamiliesRows hostFamiliesPages={hostFamiliesPages.pages} />;
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

      <Main>
        {content}

        {query.hasNextPage && (
          <Section>
            <Button
              onClick={() => query.fetchNextPage()}
              variant="outlined"
              className="mx-auto"
            >
              En afficher plus
            </Button>
          </Section>
        )}
      </Main>
    </div>
  );
}

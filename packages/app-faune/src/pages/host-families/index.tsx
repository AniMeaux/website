import {
  SearchableHostFamilyItem,
  SearchableHostFamilyItemPlaceholder,
  useAllHostFamilies,
} from "@animeaux/app-core";
import {
  getErrorMessage,
  PaginatedResponse,
  SearchableHostFamily,
} from "@animeaux/shared-entities";
import {
  Button,
  EmptyMessage,
  Main,
  Message,
  Placeholders,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { Header } from "../../core/header";
import { PageTitle } from "../../core/pageTitle";

function LoadingRows() {
  return (
    <ul className="px-2">
      <Placeholders count={5}>
        <li>
          <SearchableHostFamilyItemPlaceholder />
        </li>
      </Placeholders>
    </ul>
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

  return <ul className="px-2">{children}</ul>;
}

export default function HostFamilyListPage() {
  const router = useRouter();
  const deleteSucceeded = router.query.deleteSucceeded != null;
  const creationSucceeded = router.query.creationSucceeded != null;

  const [hostFamiliesPages, hostFamiliesPagesRequest] = useAllHostFamilies();

  let content: React.ReactNode | null = null;
  let hostFamiliesCount: string = "";

  if (hostFamiliesPages != null) {
    // There is allways at least one page.
    hostFamiliesCount = `(${hostFamiliesPages.pages[0].hitsTotalCount})`;
    content = <HostFamiliesRows hostFamiliesPages={hostFamiliesPages.pages} />;
  } else if (hostFamiliesPagesRequest.isLoading) {
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
        {hostFamiliesPagesRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(hostFamiliesPagesRequest.error)}
          </Message>
        )}

        {deleteSucceeded && (
          <Message type="success" className="mx-4 mb-4">
            La famille d'accueil a bien été supprimée
          </Message>
        )}

        {creationSucceeded && (
          <Message type="success" className="mx-4 mb-4">
            La famille d'accueil a bien été créé
          </Message>
        )}

        {content}

        {hostFamiliesPagesRequest.hasNextPage && (
          <Button
            onClick={() => hostFamiliesPagesRequest.fetchNextPage()}
            variant="outlined"
            className="mx-auto mt-4"
          >
            En afficher plus
          </Button>
        )}
      </Main>

      {/* <Navigation /> */}
    </div>
  );
}

import {
  Header,
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
  MessageSection,
  Placeholders,
  Section,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { PageTitle } from "../../core/pageTitle";

function LoadingRows() {
  return (
    <ul>
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

  return <ul>{children}</ul>;
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
          <MessageSection>
            <Message type="error">
              {getErrorMessage(hostFamiliesPagesRequest.error)}
            </Message>
          </MessageSection>
        )}

        {deleteSucceeded && (
          <MessageSection>
            <Message type="success">
              La famille d'accueil a bien été supprimée
            </Message>
          </MessageSection>
        )}

        {creationSucceeded && (
          <MessageSection>
            <Message type="success">
              La famille d'accueil a bien été créé
            </Message>
          </MessageSection>
        )}

        {content != null && <Section>{content}</Section>}

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

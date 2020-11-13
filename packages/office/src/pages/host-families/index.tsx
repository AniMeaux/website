import {
  getErrorMessage,
  HostFamily,
  PaginatedResponse,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { FaPlus } from "react-icons/fa";
import { useAllHostFamilies } from "../../core/hostFamily/hostFamilyQueries";
import { ResourceIcon } from "../../core/resource";
import { useCurrentUser } from "../../core/user/currentUserContext";
import { Avatar } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { EmptyMessage } from "../../ui/emptyMessage";
import { SearchInput } from "../../ui/formElements/searchInput";
import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
} from "../../ui/item";
import { Header, HeaderCurrentUserAvatar } from "../../ui/layouts/header";
import { Main, PageLayout, PageTitle } from "../../ui/layouts/page";
import { Placeholder, Placeholders } from "../../ui/loaders/placeholder";
import { Message } from "../../ui/message";
import { PrimaryActionLink } from "../../ui/primaryAction";

type HostFamilyItemProps = {
  hostFamily: HostFamily;
  active?: boolean;
};

function HostFamilyItem({ hostFamily, active }: HostFamilyItemProps) {
  return (
    <LinkItem
      size="large"
      href={active ? "/host-families" : `/host-families/${hostFamily.id}`}
      active={active}
    >
      <ItemIcon>
        <Avatar>
          <ResourceIcon resourceKey="host_family" />
        </Avatar>
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{hostFamily.name}</ItemMainText>

        <ItemSecondaryText>{hostFamily.address}</ItemSecondaryText>
      </ItemContent>
    </LinkItem>
  );
}

type HostFamiliesRowsProps = {
  hasSearch: boolean;
  hostFamiliesPages: PaginatedResponse<HostFamily>[];
  activeHostFamilyId: string | null;
};

function HostFamiliesRows({
  hasSearch,
  hostFamiliesPages,
  activeHostFamilyId,
}: HostFamiliesRowsProps) {
  // There is allways at least one page.
  if (hostFamiliesPages[0].hits.length === 0) {
    return (
      <li>
        <EmptyMessage>
          {hasSearch
            ? "Aucune famille d'accueil trouvée."
            : "Il n'y a pas encore de famille d'accueil."}
        </EmptyMessage>
      </li>
    );
  }

  const children: React.ReactNode[] = [];

  hostFamiliesPages.forEach((page) => {
    page.hits.forEach((hostFamily) => {
      children.push(
        <li key={hostFamily.id}>
          <HostFamilyItem
            hostFamily={hostFamily}
            active={activeHostFamilyId === hostFamily.id}
          />
        </li>
      );
    });
  });

  return <>{children}</>;
}

function LoadingRows() {
  return (
    <Placeholders count={5}>
      <li>
        <Item size="large">
          <ItemIcon>
            <Placeholder preset="avatar" />
          </ItemIcon>

          <ItemContent>
            <Placeholder preset="label" />
            <Placeholder preset="text" className="text-xs" />
          </ItemContent>
        </Item>
      </li>
    </Placeholders>
  );
}

type HostFamiliesPageProps = {
  children?: React.ReactNode;
};

export default HostFamiliesPage;
export function HostFamiliesPage({ children }: HostFamiliesPageProps) {
  const router = useRouter();
  const activeHostFamilyId: string | null =
    (router.query.hostFamilyId as string) ?? null;

  const { currentUser } = useCurrentUser();
  const canEdit = currentUser.role.resourcePermissions.host_family;

  const [search, setSearch] = React.useState("");
  const [hostFamiliesPages, hostFamiliesPagesRequest] = useAllHostFamilies({
    search,
  });

  let body: React.ReactNode | null = null;
  if (hostFamiliesPages != null) {
    body = (
      <HostFamiliesRows
        hasSearch={search !== ""}
        hostFamiliesPages={hostFamiliesPages}
        activeHostFamilyId={activeHostFamilyId}
      />
    );
  } else if (hostFamiliesPagesRequest.isLoading) {
    body = <LoadingRows />;
  }

  return (
    <PageLayout
      header={
        <Header>
          <SearchInput
            onSearch={setSearch}
            placeholder="Chercher une famille d'accueil"
            className="mr-2 flex-1 md:flex-none md:w-7/12"
          />

          <HeaderCurrentUserAvatar />
        </Header>
      }
    >
      <PageTitle title="Familles d'accueil" />

      <Main className="px-2">
        {hostFamiliesPagesRequest.error != null && (
          <Message type="error" className="mx-2 mb-2">
            {getErrorMessage(hostFamiliesPagesRequest.error)}
          </Message>
        )}

        <ul>{body}</ul>

        {hostFamiliesPagesRequest.canFetchMore && (
          <Button onClick={() => hostFamiliesPagesRequest.fetchMore()}>
            En afficher plus
          </Button>
        )}

        {canEdit && (
          <PrimaryActionLink href="./new">
            <FaPlus />
          </PrimaryActionLink>
        )}
      </Main>

      {children}
    </PageLayout>
  );
}

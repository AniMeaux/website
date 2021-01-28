import { getErrorMessage, HostFamily } from "@animeaux/shared-entities";
import { useRouter } from "next/router";
import * as React from "react";
import { FaMapMarker, FaPen, FaPhone } from "react-icons/fa";
import {
  useDeleteHostFamily,
  useHostFamily,
} from "../../../core/hostFamily/hostFamilyQueries";
import { PageComponent } from "../../../core/pageComponent";
import { useCurrentUser } from "../../../core/user/currentUserContext";
import { ButtonWithConfirmation } from "../../../ui/button";
import { Item, ItemContent, ItemIcon, ItemMainText } from "../../../ui/item";
import { Aside, AsideLayout } from "../../../ui/layouts/aside";
import {
  AsideHeaderTitle,
  Header,
  HeaderCloseLink,
  HeaderPlaceholder,
} from "../../../ui/layouts/header";
import { PageTitle } from "../../../ui/layouts/page";
import { Section, SectionTitle } from "../../../ui/layouts/section";
import { Placeholder, Placeholders } from "../../../ui/loaders/placeholder";
import { Message } from "../../../ui/message";
import { PrimaryActionLink } from "../../../ui/primaryAction";
import { Separator } from "../../../ui/separator";
import { HostFamiliesPage } from "../index";

function DetailsSection({ hostFamily }: { hostFamily: HostFamily }) {
  return (
    <Section>
      <SectionTitle>Détails</SectionTitle>

      <ul>
        <li>
          <Item>
            <ItemIcon>
              <FaMapMarker />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.address}</ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaPhone />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.phone}</ItemMainText>
            </ItemContent>
          </Item>
        </li>
      </ul>
    </Section>
  );
}

function DetailsPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <ul>
        <Placeholders count={2}>
          <li>
            <Item>
              <ItemIcon>
                <Placeholder preset="icon" />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  <Placeholder preset="label" />
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        </Placeholders>
      </ul>
    </Section>
  );
}

function ActionsSection({ hostFamily }: { hostFamily: HostFamily }) {
  const [deleteHostFamily, deleteHostFamilyRequest] = useDeleteHostFamily();

  return (
    <Section className="px-4">
      {deleteHostFamilyRequest.error != null && (
        <Message type="error" className="mb-4">
          {getErrorMessage(deleteHostFamilyRequest.error)}
        </Message>
      )}

      <ul>
        <li>
          <ButtonWithConfirmation
            confirmationMessage={`Êtes-vous sûr de vouloir supprimer la famille d'accueil ${hostFamily.name} ?`}
            onClick={() => deleteHostFamily(hostFamily.id)}
            // TODO: Prevent delete if it is used by animals.
            color="red"
            className="w-full"
          >
            Supprimer
          </ButtonWithConfirmation>
        </li>
      </ul>
    </Section>
  );
}

function ActionsPlaceholderSection() {
  return (
    <Section className="px-4">
      <ul>
        <li>
          <Placeholder preset="input" />
        </li>
      </ul>
    </Section>
  );
}

const HostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const [hostFamily, hostFamilyRequest] = useHostFamily(hostFamilyId);

  const { currentUser } = useCurrentUser();

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;
  if (hostFamily != null) {
    pageTitle = hostFamily.name;
    headerTitle = hostFamily.name;
  } else if (hostFamilyRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (hostFamilyRequest.error != null) {
    pageTitle = "Oups";
    headerTitle = "Oups";
  }

  let body: React.ReactNode | null = null;
  if (hostFamily != null) {
    body = (
      <>
        <DetailsSection hostFamily={hostFamily} />
        {currentUser.role.resourcePermissions.host_family && (
          <>
            <Separator />
            <ActionsSection hostFamily={hostFamily} />

            <PrimaryActionLink href="edit">
              <FaPen />
            </PrimaryActionLink>
          </>
        )}
      </>
    );
  } else if (hostFamilyRequest.isLoading) {
    body = (
      <>
        <DetailsPlaceholderSection />
        {currentUser.role.resourcePermissions.host_family && (
          <>
            <Separator />
            <ActionsPlaceholderSection />
          </>
        )}
      </>
    );
  }

  return (
    <AsideLayout>
      <Header>
        <HeaderPlaceholder />
        <AsideHeaderTitle>{headerTitle}</AsideHeaderTitle>
        <HeaderCloseLink href=".." />
      </Header>

      <PageTitle title={pageTitle} />

      <Aside>
        {hostFamilyRequest.error != null && (
          <Message type="error" className="mx-4 mb-4">
            {getErrorMessage(hostFamilyRequest.error)}
          </Message>
        )}

        {body}
      </Aside>
    </AsideLayout>
  );
};

HostFamilyPage.WrapperComponent = HostFamiliesPage;

export default HostFamilyPage;

import {
  Header,
  PageComponent,
  useDeleteHostFamily,
  useHostFamily,
} from "@animeaux/app-core";
import { HostFamily, UserGroup } from "@animeaux/shared-entities";
import {
  ActionSection,
  ActionSectionList,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Placeholder,
  Placeholders,
  resolveUrl,
  Section,
  SectionTitle,
  Separator,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaMapMarker, FaPen, FaPhone } from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

function ContactSection({ hostFamily }: { hostFamily: HostFamily }) {
  return (
    <Section>
      <SectionTitle>Contact</SectionTitle>

      <ul>
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

        <li>
          <Item>
            <ItemIcon>
              <FaEnvelope />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.email}</ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaMapMarker />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {hostFamily.address}, {hostFamily.zipCode} {hostFamily.city}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>
      </ul>
    </Section>
  );
}

function ContactPlaceholderSection() {
  return (
    <Section>
      <SectionTitle>
        <Placeholder preset="text" />
      </SectionTitle>

      <ul>
        <Placeholders count={3}>
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
  const router = useRouter();
  const [deleteHostFamily] = useDeleteHostFamily({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  return (
    <ActionSection>
      <ActionSectionList>
        <ButtonWithConfirmation
          confirmationMessage={[
            `Êtes-vous sûr de vouloir supprimer la famille d'accueil ${hostFamily.name} ?`,
            "L'action est irréversible.",
          ].join("\n")}
          onClick={() => deleteHostFamily(hostFamily.id)}
          // TODO: Prevent delete if it is referenced by animals.
          color="red"
        >
          Supprimer
        </ButtonWithConfirmation>
      </ActionSectionList>
    </ActionSection>
  );
}

function ActionsPlaceholderSection() {
  return (
    <ActionSection>
      <ActionSectionList>
        <Placeholder preset="button" />
      </ActionSectionList>
    </ActionSection>
  );
}

const HostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const [hostFamily, { error, isLoading }] = useHostFamily(hostFamilyId);

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (hostFamily != null) {
    pageTitle = hostFamily.name;
    headerTitle = hostFamily.name;
  } else if (isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  let content: React.ReactNode | null = null;

  if (hostFamily != null) {
    content = (
      <>
        <ContactSection hostFamily={hostFamily} />
        <Separator />
        <ActionsSection hostFamily={hostFamily} />
      </>
    );
  } else if (isLoading) {
    content = (
      <>
        <ContactPlaceholderSection />
        <Separator />
        <ActionsPlaceholderSection />
      </>
    );
  }

  return (
    <div>
      <PageTitle title={pageTitle} />

      <Header
        headerTitle={headerTitle}
        canGoBack
        action={
          hostFamily == null
            ? undefined
            : {
                href: "./edit",
                icon: FaPen,
                label: "Modifier",
              }
        }
      />

      <Main>{content}</Main>
    </div>
  );
};

HostFamilyPage.authorisedGroups = [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER];

export default HostFamilyPage;

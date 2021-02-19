import {
  Header,
  PageComponent,
  renderQueryEntity,
  useDeleteHostFamily,
  useHostFamily,
} from "@animeaux/app-core";
import { HostFamily, UserGroup } from "@animeaux/shared-entities";
import {
  ButtonLink,
  ButtonSection,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  Main,
  Placeholder,
  Placeholders,
  QuickActions,
  resolveUrl,
  Section,
  SectionTitle,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import { FaEnvelope, FaMapMarker, FaPen, FaPhone } from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

type HostFamilyProps = {
  hostFamily: HostFamily;
};

function ContactSection({ hostFamily }: HostFamilyProps) {
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

function DeleteHostFamilyButton({ hostFamily }: HostFamilyProps) {
  const router = useRouter();
  const [deleteHostFamily] = useDeleteHostFamily({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  return (
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
  );
}

const HostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const query = useHostFamily(hostFamilyId);

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (hostFamily) => hostFamily.name,
    renderPlaceholder: () => <ContactPlaceholderSection />,
    renderEntity: (hostFamily) => <ContactSection hostFamily={hostFamily} />,
  });

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />

      <Main>
        {content}

        {query.data != null && (
          <QuickActions icon={FaPen}>
            <ButtonSection>
              <ButtonLink href="./edit" variant="outlined">
                Modifier
              </ButtonLink>

              <DeleteHostFamilyButton hostFamily={query.data} />
            </ButtonSection>
          </QuickActions>
        )}
      </Main>
    </div>
  );
};

HostFamilyPage.authorisedGroups = [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER];

export default HostFamilyPage;

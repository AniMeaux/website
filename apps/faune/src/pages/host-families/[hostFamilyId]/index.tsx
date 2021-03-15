import {
  Header,
  PageComponent,
  renderQueryEntity,
  useDeleteHostFamily,
  useHostFamily,
} from "@animeaux/app-core";
import {
  getHostFamilyFullAddress,
  HostFamily,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  ButtonItem,
  HeaderTitle,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  Markdown,
  ModalHeader,
  Placeholder,
  Placeholders,
  QuickActions,
  Section,
  SectionTitle,
  useRouter,
  withConfirmation,
} from "@animeaux/ui-library";
import * as React from "react";
import {
  FaAngleRight,
  FaEnvelope,
  FaMapMarker,
  FaPen,
  FaPhone,
  FaTrash,
} from "react-icons/fa";
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
          <LinkItem href={`tel:${hostFamily.phone}`}>
            <ItemIcon>
              <FaPhone />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.phone}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <LinkItem href={`mailto:${hostFamily.email}`}>
            <ItemIcon>
              <FaEnvelope />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{hostFamily.email}</ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>

        <li>
          <LinkItem
            shouldOpenInNewTab
            href={`http://maps.google.com/?q=${getHostFamilyFullAddress(
              hostFamily
            )}`}
          >
            <ItemIcon>
              <FaMapMarker />
            </ItemIcon>

            <ItemContent>
              <Markdown>{getHostFamilyFullAddress(hostFamily)}</Markdown>
            </ItemContent>
          </LinkItem>
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
      router.backIfPossible("..");
    },
  });

  const confirmationMessage = [
    `Êtes-vous sûr de vouloir supprimer ${hostFamily.name} ?`,
    "L'action est irréversible.",
  ].join("\n");

  return (
    <ButtonItem
      onClick={withConfirmation(confirmationMessage, () => {
        deleteHostFamily(hostFamily.id);
      })}
      // TODO: Prevent delete if it is referenced by animals.
      className="text-red-500 font-medium"
    >
      <ItemIcon>
        <FaTrash />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>Supprimer</ItemMainText>
      </ItemContent>
    </ButtonItem>
  );
}

const HostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const query = useHostFamily(hostFamilyId);

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (hostFamily) => hostFamily.name,
    renderPlaceholder: () => <ContactPlaceholderSection />,
    renderEntity: (hostFamily) => (
      <>
        <ContactSection hostFamily={hostFamily} />

        <QuickActions icon={FaPen}>
          <ModalHeader>
            <HeaderTitle>{hostFamily.name}</HeaderTitle>
          </ModalHeader>

          <Section>
            <LinkItem href="./edit">
              <ItemIcon>
                <FaPen />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>Modifier</ItemMainText>
              </ItemContent>

              <ItemIcon>
                <FaAngleRight />
              </ItemIcon>
            </LinkItem>
          </Section>

          <hr className="mx-4 my-1 border-t border-gray-100" />

          <Section>
            <DeleteHostFamilyButton hostFamily={hostFamily} />
          </Section>
        </QuickActions>
      </>
    ),
  });

  return (
    <div>
      <PageTitle title={pageTitle} />
      <Header headerTitle={headerTitle} canGoBack />

      <Main>{content}</Main>
    </div>
  );
};

HostFamilyPage.authorisedGroups = [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER];

export default HostFamilyPage;

import {
  getHostFamilyFullAddress,
  HostFamily,
  UserGroup,
} from "@animeaux/shared-entities";
import {
  SearchableAnimalItemPlaceholder,
  SearchableAnimalLinkItem,
} from "animal/animalItems";
import { useAllAnimals } from "animal/queries";
import { Button } from "core/actions/button";
import { QuickActions } from "core/actions/quickAction";
import { ErrorItem } from "core/dataDisplay/errorMessage";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "core/dataDisplay/item";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section, SectionBox, SectionTitle } from "core/layouts/section";
import { Separator } from "core/layouts/separator";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { PageTitle } from "core/pageTitle";
import { useModal } from "core/popovers/modal";
import { renderInfiniteItemList, renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { ChildrenProp, PageComponent } from "core/types";
import { withConfirmation } from "core/withConfirmation";
import {
  useDeleteHostFamily,
  useHostFamily,
} from "hostFamily/hostFamilyQueries";
import {
  FaAngleRight,
  FaEnvelope,
  FaMapMarker,
  FaPen,
  FaPhone,
  FaTrash,
} from "react-icons/fa";

type HostFamilyProps = {
  hostFamily: HostFamily;
};

function ContactSection({ hostFamily }: HostFamilyProps) {
  return (
    <SectionBox>
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
            shouldOpenInNewTarget
            href={`http://maps.google.com/?q=${getHostFamilyFullAddress(
              hostFamily
            )}`}
          >
            <ItemIcon>
              <FaMapMarker />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {getHostFamilyFullAddress(hostFamily)}
              </ItemMainText>
            </ItemContent>
          </LinkItem>
        </li>
      </ul>
    </SectionBox>
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
  const { onDismiss } = useModal();
  const [deleteHostFamily] = useDeleteHostFamily({
    onSuccess() {
      onDismiss();
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
      color="red"
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

function HostedAnimalsSection({ children }: ChildrenProp) {
  return (
    <Section>
      <SectionTitle>En accueil</SectionTitle>
      {children}
    </Section>
  );
}

function ActionsSection({ hostFamily }: HostFamilyProps) {
  const { onDismiss } = useModal();

  return (
    <>
      <Section>
        <LinkItem href="./edit" onClick={onDismiss}>
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

      <Separator />

      <Section>
        <DeleteHostFamilyButton hostFamily={hostFamily} />
      </Section>
    </>
  );
}

const HostFamilyPage: PageComponent = () => {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;

  const hostedAnimalsQuery = useAllAnimals({ hostFamilyId });
  const hostedAnimals = renderInfiniteItemList(hostedAnimalsQuery, {
    getItemKey: (animal) => animal.id,
    renderPlaceholderItem: () => <SearchableAnimalItemPlaceholder />,
    placeholderCount: 2,
    emptyMessage: "Aucun animal en accueil",
    renderEmptyMessage: ({ children }) => (
      <Item>
        <ItemContent>
          <ItemMainText>{children}</ItemMainText>
        </ItemContent>
      </Item>
    ),
    renderItem: (animal) => (
      <SearchableAnimalLinkItem
        animal={animal}
        href={`/animals/${animal.id}`}
      />
    ),
    renderError: (props) => <ErrorItem {...props} />,
    renderRetryButton: ({ retry, children }) => (
      <Button size="small" onClick={retry}>
        {children}
      </Button>
    ),
  });

  const query = useHostFamily(hostFamilyId);
  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (hostFamily) => hostFamily.name,
    renderPlaceholder: () => <ContactPlaceholderSection />,
    renderEntity: (hostFamily) => (
      <>
        <ContactSection hostFamily={hostFamily} />
        <HostedAnimalsSection>{hostedAnimals.content}</HostedAnimalsSection>

        <QuickActions icon={<FaPen />}>
          <ActionsSection hostFamily={hostFamily} />
        </QuickActions>
      </>
    ),
  });

  return (
    <ApplicationLayout>
      <PageTitle title={pageTitle} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>{headerTitle}</HeaderTitle>
      </Header>

      <Main>{content}</Main>
      <Navigation onlyLargeEnough />
    </ApplicationLayout>
  );
};

HostFamilyPage.authorisedGroups = [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER];

export default HostFamilyPage;

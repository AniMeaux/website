import {
  Animal,
  AnimalGender,
  AnimalGenderLabels,
  AnimalSpeciesLabels,
  doesGroupsIntersect,
  formatAge,
  formatLongDate,
  getAnimalDisplayName,
  getHostFamilyFullAddress,
  HostFamily,
  Trilean,
  TrileanLabels,
  UserGroup,
} from "@animeaux/shared-entities";
import { copyToClipboard } from "core/clipboard";
import { PageTitle } from "core/pageTitle";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { AnimalGenderIcon } from "entities/animal/animalGenderIcon";
import { AnimalSpeciesIcon } from "entities/animal/animalSpeciesIcon";
import { useAnimal, useDeleteAnimal } from "entities/animal/queries";
import { useCurrentUser } from "entities/user/currentUserContext";
import * as React from "react";
import {
  FaAdjust,
  FaAngleRight,
  FaBirthdayCake,
  FaCut,
  FaEllipsisH,
  FaEnvelope,
  FaExclamationTriangle,
  FaHandHoldingHeart,
  FaHome,
  FaImages,
  FaLink,
  FaMapMarker,
  FaPen,
  FaPhone,
  FaShare,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa";
import { Button } from "ui/actions/button";
import { QuickActions } from "ui/actions/quickAction";
import { ImageSlideshow } from "ui/dataDisplay/imageSlideshow";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "ui/dataDisplay/item";
import { Markdown } from "ui/dataDisplay/markdown";
import { StatusBadge } from "ui/dataDisplay/statusBadge";
import { ApplicationLayout } from "ui/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "ui/layouts/header";
import { Main } from "ui/layouts/main";
import { Navigation } from "ui/layouts/navigation";
import { Section, SectionBox, SectionTitle } from "ui/layouts/section";
import { Separator } from "ui/layouts/separator";
import {
  Modal,
  ModalHeader,
  ModalHeaderTitle,
  useModal,
} from "ui/popovers/modal";
import { withConfirmation } from "ui/withConfirmation";

type AnimalProps = {
  animal: Animal;
};

function PicturesSection({ animal }: AnimalProps) {
  const picturesId = [animal.avatarId].concat(animal.picturesId);
  return <ImageSlideshow images={picturesId} alt={animal.officialName} />;
}

function HighlightsSection({ animal }: AnimalProps) {
  const [isSharingOpen, setIsSharingOpen] = React.useState(false);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);

  return (
    <header
      style={{
        padding: "var(--spacing-l)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <StatusBadge status={animal.status} />

      <Button
        size="small"
        onClick={() => setIsSharingOpen(true)}
        ref={buttonElement}
      >
        <FaShare />
        <span>Partager</span>
      </Button>

      <Modal
        open={isSharingOpen}
        onDismiss={() => setIsSharingOpen(false)}
        referenceElement={buttonElement}
        placement="bottom-end"
      >
        <Section>
          <ButtonItem
            onClick={async () => {
              setIsSharingOpen(false);
              await copyToClipboard(document.location.href);
            }}
          >
            <ItemIcon>
              <FaLink />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>Copier le lien</ItemMainText>
            </ItemContent>
          </ButtonItem>

          {"share" in navigator && (
            <ButtonItem
              onClick={async () => {
                setIsSharingOpen(false);

                try {
                  await navigator.share({
                    text: getAnimalDisplayName(animal),
                    title: getAnimalDisplayName(animal),
                    url: document.location.href,
                  });
                } catch (error) {
                  // The user cancelled the sharing.
                  // We don't want to spam the error reporter with this.
                  if (
                    !(error instanceof DOMException) ||
                    error.name !== "AbortError"
                  ) {
                    throw error;
                  }
                }
              }}
            >
              <ItemIcon>
                <FaShareAlt />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>Partager via...</ItemMainText>
              </ItemContent>

              <ItemIcon>
                <FaAngleRight />
              </ItemIcon>
            </ButtonItem>
          )}
        </Section>
      </Modal>
    </header>
  );
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

function ProfileSection({ animal }: AnimalProps) {
  const speciesLabels = [
    AnimalSpeciesLabels[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ].filter(isDefined);

  return (
    <SectionBox>
      <ul>
        <li>
          <Item>
            <ItemIcon>
              <AnimalSpeciesIcon species={animal.species} />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{speciesLabels.join(" • ")}</ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <AnimalGenderIcon gender={animal.gender} />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{AnimalGenderLabels[animal.gender]}</ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaBirthdayCake />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {formatLongDate(animal.birthdate)} (
                {formatAge(animal.birthdate)})
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>
      </ul>
    </SectionBox>
  );
}

function HostFamilyModal({ hostFamily }: { hostFamily: HostFamily }) {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const fullAddress = getHostFamilyFullAddress(hostFamily);

  const { onDismiss } = useModal();

  return (
    <>
      <ModalHeader>
        <ModalHeaderTitle>{hostFamily.name}</ModalHeaderTitle>
      </ModalHeader>

      <Section>
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
              href={`http://maps.google.com/?q=${fullAddress}`}
            >
              <ItemIcon>
                <FaMapMarker />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{fullAddress}</ItemMainText>
              </ItemContent>
            </LinkItem>
          </li>

          {isCurrentUserAdmin && (
            <li>
              <LinkItem
                href={`/host-families/${hostFamily.id}`}
                onClick={onDismiss}
              >
                <ItemIcon>
                  <FaEllipsisH />
                </ItemIcon>

                <ItemContent>
                  <ItemMainText>Voir plus d'informations</ItemMainText>
                </ItemContent>
              </LinkItem>
            </li>
          )}
        </ul>
      </Section>
    </>
  );
}

const IsOkColors: Record<Trilean, string> = {
  [Trilean.FALSE]: "var(--alert-500)",
  [Trilean.TRUE]: "var(--success-500)",
  [Trilean.UNKNOWN]: "inherit",
};

type OtherAnimalSituationProps = {
  label: string;
  value: Trilean;
};

function OtherAnimalSituation({ label, value }: OtherAnimalSituationProps) {
  return (
    <li
      style={{
        background: "var(--dark-30)",
        borderRadius: "var(--border-radius-m)",
        padding: "var(--spacing-s)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "var(--font-size-s)",
          lineHeight: "var(--line-height-s)",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontWeight: "var(--font-weight-bold)" as any,
          color: IsOkColors[value],
        }}
      >
        {TrileanLabels[value]}
      </span>
    </li>
  );
}

function OtherAnimalsSituations({ animal }: AnimalProps) {
  return (
    <ul
      style={{
        padding: "0 var(--spacing-s)",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "auto",
        gap: "var(--spacing-s)",
      }}
    >
      <OtherAnimalSituation label="Ok enfants" value={animal.isOkChildren} />
      <OtherAnimalSituation label="Ok chiens" value={animal.isOkDogs} />
      <OtherAnimalSituation label="Ok chats" value={animal.isOkCats} />
    </ul>
  );
}

function SituationSection({ animal }: AnimalProps) {
  const [areHostFamilyDetailsVisible, setAreHostFamilyDetailsVisible] =
    React.useState(false);
  const referenceElement = React.useRef<HTMLButtonElement>(null!);

  return (
    <Section>
      <SectionTitle>Situation</SectionTitle>

      <ul style={{ marginBottom: "var(--spacing-s)" }}>
        {animal.hostFamily != null && (
          <li>
            <ButtonItem onClick={() => setAreHostFamilyDetailsVisible(true)}>
              <ItemIcon>
                <FaHome />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  En FA chez{" "}
                  <strong
                    ref={referenceElement}
                    style={{ color: "var(--primary-500)" }}
                  >
                    {animal.hostFamily.name}
                  </strong>
                </ItemMainText>
              </ItemContent>
            </ButtonItem>

            <Modal
              open={areHostFamilyDetailsVisible}
              onDismiss={() => setAreHostFamilyDetailsVisible(false)}
              referenceElement={referenceElement}
              dismissLabel="Fermer"
              placement="bottom-start"
            >
              <HostFamilyModal hostFamily={animal.hostFamily} />
            </Modal>
          </li>
        )}

        <li>
          <Item>
            <ItemIcon>
              <FaCut />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {animal.isSterilized ? "Est" : "N'est"}{" "}
                <strong>
                  {animal.isSterilized ? "" : "pas "}
                  stérilisé{animal.gender === AnimalGender.FEMALE ? "e" : ""}
                </strong>
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaHandHoldingHeart />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                Pris{animal.gender === AnimalGender.FEMALE ? "e" : ""} en charge
                le <strong>{formatLongDate(animal.pickUpDate)}</strong>
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        {animal.comments !== "" && (
          <li>
            <Item>
              <ItemIcon>
                <FaExclamationTriangle />
              </ItemIcon>

              <ItemContent>
                <Markdown>{animal.comments}</Markdown>
              </ItemContent>
            </Item>
          </li>
        )}
      </ul>

      <OtherAnimalsSituations animal={animal} />
    </Section>
  );
}

function DescriptionSection({ animal }: AnimalProps) {
  if (animal.description === "") {
    return null;
  }

  return (
    <Section>
      <SectionTitle>Description</SectionTitle>
      <Markdown style={{ padding: "0 var(--spacing-s)" }}>
        {animal.description}
      </Markdown>
    </Section>
  );
}

function DeleteAnimalButton({ animal }: AnimalProps) {
  const router = useRouter();
  const { onDismiss } = useModal();
  const [deleteAnimal] = useDeleteAnimal({
    onSuccess() {
      onDismiss();
      router.backIfPossible("..");
    },
  });

  const confirmationMessage = [
    `Êtes-vous sûr de vouloir supprimer ${animal.officialName} ?`,
    "L'action est irréversible.",
  ].join("\n");

  return (
    <ButtonItem
      onClick={withConfirmation(confirmationMessage, () => {
        deleteAnimal(animal);
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

function ActionsSection({ animal }: AnimalProps) {
  const { onDismiss } = useModal();
  return (
    <>
      <Section>
        <LinkItem href="./edit/profile" onClick={onDismiss}>
          <ItemIcon>
            <AnimalSpeciesIcon species={animal.species} />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier le profil</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>

        <LinkItem href="./edit/situation" onClick={onDismiss}>
          <ItemIcon>
            <FaAdjust />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier la situation</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>

        <LinkItem href="./edit/pictures" onClick={onDismiss}>
          <ItemIcon>
            <FaImages />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>Modifier les photos</ItemMainText>
          </ItemContent>

          <ItemIcon>
            <FaAngleRight />
          </ItemIcon>
        </LinkItem>
      </Section>

      <Separator />

      <Section>
        <DeleteAnimalButton animal={animal} />
      </Section>
    </>
  );
}

const AnimalPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const router = useRouter();
  const animalId = router.query.animalId as string;
  const query = useAnimal(animalId);

  const { pageTitle, headerTitle, content } = renderQueryEntity(query, {
    getDisplayedText: (animal) => getAnimalDisplayName(animal),
    renderPlaceholder: () => null,
    renderEntity: (animal) => (
      <>
        <PicturesSection animal={animal} />
        <HighlightsSection animal={animal} />
        <ProfileSection animal={animal} />
        <SituationSection animal={animal} />
        <DescriptionSection animal={animal} />

        {isCurrentUserAdmin && (
          <QuickActions icon={FaPen}>
            <ActionsSection animal={animal} />
          </QuickActions>
        )}
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

AnimalPage.authorisedGroups = [
  UserGroup.ADMIN,
  UserGroup.ANIMAL_MANAGER,
  UserGroup.VETERINARIAN,
];

export default AnimalPage;

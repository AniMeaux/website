import {
  AnimalGenderIcon,
  AnimalSpeciesIcon,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimal,
  useCurrentUser,
  useDeleteAnimal,
} from "@animeaux/app-core";
import {
  Animal,
  AnimalColorLabels,
  AnimalGender,
  AnimalGenderLabels,
  AnimalSpeciesLabels,
  AnimalStatus,
  AnimalStatusLabels,
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
import {
  Button,
  ButtonItem,
  copyToClipboard,
  HeaderTitle,
  Image,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  Markdown,
  Modal,
  ModalHeader,
  QuickActions,
  Section,
  SectionBox,
  SectionTitle,
  useRouter,
  withConfirmation,
} from "@animeaux/ui-library";
import cn from "classnames";
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
import { PageTitle } from "../../../core/pageTitle";

type AnimalProps = {
  animal: Animal;
};

function PicturesSection({ animal }: AnimalProps) {
  const picturesId = [animal.avatarId].concat(animal.picturesId);

  return (
    <section
      className="overflow-auto no-scrollbars"
      style={{
        scrollSnapType: "x mandatory",
        scrollPaddingLeft: "1rem",
      }}
    >
      <div className="flex w-min px-4 space-x-2">
        {picturesId.map((pictureId, pictureIndex) => (
          <div
            key={pictureId}
            className="relative flex-none"
            style={{
              scrollSnapAlign: "start",
              // 100vw might be an issue when vertical scrollbars are visible.
              width: "calc(100vw - 2rem)",
            }}
          >
            <Image
              alt={animal.officialName}
              image={pictureId}
              className="w-full h-60 object-cover rounded-xl"
            />

            {picturesId.length > 1 && (
              <span className="absolute top-1 right-1 px-2 py-1 bg-black bg-opacity-70 text-white rounded-full text-xs font-medium">
                {pictureIndex + 1}/{picturesId.length}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const StatusBadgeColors: { [key in AnimalStatus]: string } = {
  [AnimalStatus.ADOPTED]: "bg-green-500 text-white",
  [AnimalStatus.DECEASED]: "bg-gray-800 text-white",
  [AnimalStatus.FREE]: "bg-gray-800 text-white",
  [AnimalStatus.OPEN_TO_ADOPTION]: "bg-blue-500 text-white",
  [AnimalStatus.OPEN_TO_RESERVATION]: "bg-blue-500 text-white",
  [AnimalStatus.RESERVED]: "bg-yellow-500 text-black",
  [AnimalStatus.UNAVAILABLE]: "bg-gray-800 text-white",
};

function StatusBadge({ status }: { status: AnimalStatus }) {
  return (
    <span
      className={cn(
        "px-6 h-8 font-serif font-bold rounded-full flex items-center text-sm",
        StatusBadgeColors[status]
      )}
    >
      {AnimalStatusLabels[status]}
    </span>
  );
}

function HighlightsSection({ animal }: AnimalProps) {
  const [isSharingOpen, setIsSharingOpen] = React.useState(false);

  return (
    <header className="p-4 flex items-center justify-between">
      <StatusBadge status={animal.status} />

      <Button
        size="small"
        variant="outlined"
        onClick={() => setIsSharingOpen(true)}
      >
        <FaShare />
        <span className="ml-2">Partager</span>
      </Button>

      <Modal open={isSharingOpen} onDismiss={() => setIsSharingOpen(false)}>
        <ModalHeader>
          <HeaderTitle>{getAnimalDisplayName(animal)}</HeaderTitle>
        </ModalHeader>

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
    animal.color != null ? AnimalColorLabels[animal.color] : null,
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
              <ItemMainText className="flex items-center">
                {speciesLabels.join(" • ")}
              </ItemMainText>
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

const IsOkColors: { [key in Trilean]: string } = {
  [Trilean.FALSE]: "text-red-500",
  [Trilean.TRUE]: "text-green-500",
  [Trilean.UNKNOWN]: "",
};

function HostFamilyModal({ hostFamily }: { hostFamily: HostFamily }) {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = doesGroupsIntersect(currentUser.groups, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const fullAddress = getHostFamilyFullAddress(hostFamily);

  return (
    <>
      <ModalHeader>
        <HeaderTitle>{hostFamily.name}</HeaderTitle>
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
              <LinkItem href={`/host-families/${hostFamily.id}`}>
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

function SituationSection({ animal }: AnimalProps) {
  const [
    areHostFamilyDetailsVisible,
    setAreHostFamilyDetailsVisible,
  ] = React.useState(false);

  return (
    <Section>
      <SectionTitle>Situation</SectionTitle>

      <ul className="space-y-2">
        {animal.hostFamily != null && (
          <li>
            <ButtonItem onClick={() => setAreHostFamilyDetailsVisible(true)}>
              <ItemIcon>
                <FaHome />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  En FA chez{" "}
                  <strong className="font-medium text-blue-500">
                    {animal.hostFamily.name}
                  </strong>
                </ItemMainText>
              </ItemContent>
            </ButtonItem>

            <Modal
              open={areHostFamilyDetailsVisible}
              onDismiss={() => setAreHostFamilyDetailsVisible(false)}
              dismissLabel="Fermer"
            >
              <HostFamilyModal hostFamily={animal.hostFamily} />
            </Modal>
          </li>
        )}

        <li>
          <ul className="px-2 flex items-center space-x-2">
            <li className="flex-1 border rounded-xl p-2">
              <div className="flex flex-col items-center">
                <span className="text-sm text-black text-opacity-60">
                  Ok enfants
                </span>

                <span
                  className={cn("font-bold", IsOkColors[animal.isOkChildren])}
                >
                  {TrileanLabels[animal.isOkChildren]}
                </span>
              </div>
            </li>

            <li className="flex-1 border rounded-xl p-2">
              <div className="flex flex-col items-center">
                <span className="text-sm text-black text-opacity-60">
                  Ok chiens
                </span>

                <span className={cn("font-bold", IsOkColors[animal.isOkDogs])}>
                  {TrileanLabels[animal.isOkDogs]}
                </span>
              </div>
            </li>

            <li className="flex-1 border rounded-xl p-2">
              <div className="flex flex-col items-center">
                <span className="text-sm text-black text-opacity-60">
                  Ok chats
                </span>

                <span className={cn("font-bold", IsOkColors[animal.isOkCats])}>
                  {TrileanLabels[animal.isOkCats]}
                </span>
              </div>
            </li>
          </ul>
        </li>

        <li>
          <Item>
            <ItemIcon>
              <FaCut />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {animal.isSterilized ? "Est" : "N'est"}{" "}
                <strong className="font-medium">
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
                le{" "}
                <strong className="font-medium">
                  {formatLongDate(animal.pickUpDate)}
                </strong>
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        {animal.comments !== "" && (
          <li>
            <Item>
              <ItemIcon className="h-6 flex items-center justufy-center self-start">
                <FaExclamationTriangle />
              </ItemIcon>

              <ItemContent>
                <Markdown>{animal.comments}</Markdown>
              </ItemContent>
            </Item>
          </li>
        )}
      </ul>
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
      <Markdown className="px-2 space-y-2">{animal.description}</Markdown>
    </Section>
  );
}

function DeleteAnimalButton({ animal }: AnimalProps) {
  const router = useRouter();
  const [deleteAnimal] = useDeleteAnimal({
    onSuccess() {
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
            <ModalHeader>
              <HeaderTitle>{getAnimalDisplayName(animal)}</HeaderTitle>
            </ModalHeader>

            <Section>
              <LinkItem href="./edit/profile">
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

              <LinkItem href="./edit/situation">
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

              <LinkItem href="./edit/pictures">
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

            <hr className="mx-4 my-1 border-t border-gray-100" />

            <Section>
              <DeleteAnimalButton animal={animal} />
            </Section>
          </QuickActions>
        )}
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

export default AnimalPage;

import {
  AnimalGenderIcon,
  AnimalSpeciesIcon,
  getAnimalPictureUrl,
  Header,
  PageComponent,
  renderQueryEntity,
  useAnimal,
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
  formatAge,
  formatLongDate,
  getAnimalDisplayName,
  getHostFamilyFullAddress,
  Trilean,
  TrileanLabels,
} from "@animeaux/shared-entities";
import {
  Avatar,
  Button,
  ButtonItem,
  ButtonLink,
  ButtonSection,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
  Main,
  Modal,
  QuickActions,
  resolveUrl,
  Section,
} from "@animeaux/ui-library";
import cn from "classnames";
import { useRouter } from "next/router";
import * as React from "react";
import {
  FaBirthdayCake,
  FaCut,
  FaEnvelope,
  FaHandHoldingHeart,
  FaHome,
  FaLink,
  FaMapMarker,
  FaPen,
  FaPhone,
  FaShare,
  FaShareAlt,
} from "react-icons/fa";
import { PageTitle } from "../../../core/pageTitle";

type AnimalProps = {
  animal: Animal;
};

function PicturesSection({ animal }: AnimalProps) {
  const picturesId = [animal.avatarId].concat(animal.picturesId);

  return (
    <section className="relative flex flex-col items-center">
      <div
        className="flex-none flex overflow-auto"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {picturesId.map((pictureId, pictureIndex) => (
          <div
            key={pictureId}
            className="relative flex-none px-4 w-full"
            style={{ scrollSnapAlign: "start" }}
          >
            <img
              src={getAnimalPictureUrl(animal, pictureId)}
              alt={animal.officialName}
              className="w-full h-60 object-cover rounded-xl"
            />

            {picturesId.length > 1 && (
              <span className="absolute top-1 right-5 px-2 py-1 bg-black bg-opacity-70 text-white rounded-full text-xs font-medium">
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
  [AnimalStatus.FREE]: "bg-green-500 text-white",
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

      <Modal
        open={isSharingOpen}
        onDismiss={() => setIsSharingOpen(false)}
        onClick={() => setIsSharingOpen(false)}
      >
        <ButtonSection>
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(document.location.href);
              } catch (error) {
                console.error("Could not copy link:", error);
              }
            }}
          >
            <FaLink />
            <span className="ml-2">Copier le lien</span>
          </Button>

          {"share" in navigator && (
            <Button
              variant="outlined"
              onClick={async () => {
                try {
                  await navigator.share({
                    text: getAnimalDisplayName(animal),
                    title: getAnimalDisplayName(animal),
                    url: document.location.href,
                  });
                } catch (error) {}
              }}
            >
              <FaShareAlt />
              <span className="ml-2">Partager via...</span>
            </Button>
          )}
        </ButtonSection>
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
    <section className="mx-4 bg-black bg-opacity-3 rounded-xl p-2">
      <ul>
        <li>
          <Item size="small">
            <ItemIcon size="small">
              <AnimalSpeciesIcon species={animal.species} />
            </ItemIcon>

            <ItemContent>
              <ItemMainText className="flex items-center">
                {speciesLabels.map((label, index) => (
                  <React.Fragment key={label}>
                    {index > 0 && (
                      <span className="mx-2 inline-block h-1 w-1 bg-black bg-opacity-80 rounded-full" />
                    )}
                    {label}
                  </React.Fragment>
                ))}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item size="small">
            <ItemIcon size="small">
              <AnimalGenderIcon gender={animal.gender} />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>{AnimalGenderLabels[animal.gender]}</ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item size="small">
            <ItemIcon size="small">
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
    </section>
  );
}

const IsOkColors: { [key in Trilean]: string } = {
  [Trilean.FALSE]: "text-red-500",
  [Trilean.TRUE]: "text-green-500",
  [Trilean.UNKNOWN]: "",
};

function SituationSection({ animal }: AnimalProps) {
  const [
    areHostFamilyDetailsVisible,
    setAreHostFamilyDetailsVisible,
  ] = React.useState(false);

  return (
    <Section>
      <h2 className="my-2 px-2 truncate text-lg font-bold font-serif">
        Situation
      </h2>

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
            >
              <Section>
                <Item size="large">
                  <ItemIcon size="large">
                    <Avatar size="large">
                      <FaHome />
                    </Avatar>
                  </ItemIcon>

                  <ItemContent>
                    <ItemMainText>{animal.hostFamily.name}</ItemMainText>
                  </ItemContent>
                </Item>
              </Section>

              <Section className="border-t border-gray-100">
                <ul>
                  <li>
                    <LinkItem
                      href={`tel:${animal.hostFamily.phone}`}
                      size="small"
                    >
                      <ItemIcon size="small">
                        <FaPhone />
                      </ItemIcon>

                      <ItemContent>
                        <ItemMainText>{animal.hostFamily.phone}</ItemMainText>
                      </ItemContent>
                    </LinkItem>
                  </li>

                  <li>
                    <LinkItem
                      href={`mailto:${animal.hostFamily.email}`}
                      size="small"
                    >
                      <ItemIcon size="small">
                        <FaEnvelope />
                      </ItemIcon>

                      <ItemContent>
                        <ItemMainText>{animal.hostFamily.email}</ItemMainText>
                      </ItemContent>
                    </LinkItem>
                  </li>

                  <li>
                    <LinkItem
                      shouldOpenInNewTab
                      href={`http://maps.google.com/?q=${getHostFamilyFullAddress(
                        animal.hostFamily
                      )}`}
                      size="small"
                    >
                      <ItemIcon size="small">
                        <FaMapMarker />
                      </ItemIcon>

                      <ItemContent>
                        <ItemMainText>
                          {getHostFamilyFullAddress(animal.hostFamily)}
                        </ItemMainText>
                      </ItemContent>
                    </LinkItem>
                  </li>
                </ul>
              </Section>
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
          <Item size="small">
            <ItemIcon size="small">
              <FaCut />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {animal.isSterilized ? "Est" : "N'est"}{" "}
                <strong className="font-medium">
                  {animal.isSterilized ? "" : "pas "}
                  stérélisé{animal.gender === AnimalGender.FEMALE ? "e" : ""}
                </strong>
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        <li>
          <Item size="small">
            <ItemIcon size="small">
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
      </ul>
    </Section>
  );
}

function DeleteAnimalButton({ animal }: AnimalProps) {
  const router = useRouter();
  const [deleteAnimal] = useDeleteAnimal({
    onSuccess() {
      router.push(resolveUrl(router.asPath, ".."));
    },
  });

  return (
    <ButtonWithConfirmation
      confirmationMessage={[
        `Êtes-vous sûr de vouloir supprimer ${animal.officialName} ?`,
        "L'action est irréversible.",
      ].join("\n")}
      onClick={() => deleteAnimal(animal)}
      color="red"
    >
      Supprimer
    </ButtonWithConfirmation>
  );
}

const AnimalPage: PageComponent = () => {
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

        <QuickActions icon={FaPen}>
          <ButtonSection>
            <ButtonLink href="./edit/profil" variant="outlined">
              Modifier le profile
            </ButtonLink>

            <ButtonLink href="./edit/situation" variant="outlined">
              Modifier la situation
            </ButtonLink>

            <ButtonLink href="./edit/pictures" variant="outlined">
              Modifier les photos
            </ButtonLink>

            <DeleteAnimalButton animal={animal} />
          </ButtonSection>
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

export default AnimalPage;

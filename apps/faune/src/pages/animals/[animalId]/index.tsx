import {
  AdoptionOption,
  Animal,
  AnimalGender,
  AnimalStatus,
  formatAge,
  hasGroups,
  Trilean,
  UserGroup,
} from "@animeaux/shared";
import invariant from "invariant";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import {
  FaAdjust,
  FaAngleRight,
  FaBirthdayCake,
  FaCertificate,
  FaCut,
  FaEllipsisH,
  FaEnvelope,
  FaExclamationTriangle,
  FaFingerprint,
  FaHandHoldingHeart,
  FaHome,
  FaImages,
  FaMapMarkerAlt,
  FaPen,
  FaPhone,
  FaTimesCircle,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { useMutation, UseMutationResult } from "react-query";
import styled from "styled-components";
import { AnimalGenderIcon } from "~/animal/animalGenderIcon";
import {
  ANIMAL_GENDER_LABELS,
  PICK_UP_REASON_LABELS,
} from "~/animal/gender/labels";
import { ADOPTION_OPTION_LABELS } from "~/animal/labels";
import { AnimalSpeciesIcon } from "~/animal/species/icon";
import { ANIMAL_SPECIES_LABELS } from "~/animal/species/labels";
import { StatusBadge } from "~/animal/status/badge";
import { ANIMAL_STATUS_LABELS } from "~/animal/status/labels";
import { QuickActions } from "~/core/actions/quickAction";
import { deleteImage } from "~/core/cloudinary";
import { ImageSlideshow } from "~/core/dataDisplay/imageSlideshow";
import { Info } from "~/core/dataDisplay/info";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "~/core/dataDisplay/item";
import { Markdown } from "~/core/dataDisplay/markdown";
import { isDefined } from "~/core/isDefined";
import { ApplicationLayout } from "~/core/layouts/applicationLayout";
import { ErrorPage } from "~/core/layouts/errorPage";
import { Header, HeaderBackLink, HeaderTitle } from "~/core/layouts/header";
import { Main } from "~/core/layouts/main";
import { Navigation } from "~/core/layouts/navigation";
import { Section, SectionBox, SectionTitle } from "~/core/layouts/section";
import { Separator } from "~/core/layouts/separator";
import { Placeholder } from "~/core/loaders/placeholder";
import { useOperationMutation, useOperationQuery } from "~/core/operations";
import { PageTitle } from "~/core/pageTitle";
import {
  Modal,
  ModalHeader,
  ModalHeaderTitle,
  useModal,
} from "~/core/popovers/modal";
import { useRouter } from "~/core/router";
import { PageComponent } from "~/core/types";
import { useCurrentUser } from "~/currentUser/currentUser";
import { theme } from "~/styles/theme";
import { TRILEAN_LABELS } from "~/trilean/labels";

const AnimalPage: PageComponent = () => {
  const { currentUser } = useCurrentUser();
  const currentUserCanEdit = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const router = useRouter();

  invariant(
    typeof router.query.animalId === "string",
    `The animalId path should be a string. Got '${typeof router.query
      .animalId}'`
  );

  const getAnimal = useOperationQuery({
    name: "getAnimal",
    params: { id: router.query.animalId },
  });

  const deleteAnimal = useOperationMutation("deleteAnimal", {
    onSuccess: (response, cache) => {
      cache.remove({
        name: "getAnimal",
        params: { id: response.body.params.id },
      });

      cache.invalidate({ name: "getAllActiveAnimals" });
      cache.invalidate({ name: "searchAnimals" });
      router.backIfPossible("..");
    },
  });

  const deleteImages = useMutation<void, Error, Animal>(async (animal) => {
    await Promise.all(
      [animal.avatarId]
        .concat(animal.picturesId)
        .map((pictureId) => deleteImage(pictureId))
    );

    deleteAnimal.mutate({ id: animal.id });
  });

  if (getAnimal.state === "error") {
    return <ErrorPage status={getAnimal.status} />;
  }

  let content: React.ReactNode = null;

  if (getAnimal.state === "success") {
    content = (
      <>
        {(deleteAnimal.state === "error" || deleteImages.isError) && (
          <Section>
            <Info variant="error" icon={<FaTimesCircle />}>
              {getAnimal.result.displayName} n'a pas pu être supprimé.
            </Info>
          </Section>
        )}

        <PicturesSection animal={getAnimal.result} />
        <HighlightsSection animal={getAnimal.result} />
        <ProfileSection animal={getAnimal.result} />
        <SituationSection animal={getAnimal.result} />
        <DescriptionSection animal={getAnimal.result} />

        {currentUserCanEdit && (
          <QuickActions icon={<FaPen />}>
            <ActionsSection
              animal={getAnimal.result}
              deleteAnimal={deleteImages}
            />
          </QuickActions>
        )}
      </>
    );
  }

  const displayName =
    getAnimal.state === "success" ? getAnimal.result.displayName : null;

  return (
    <ApplicationLayout>
      <PageTitle title={displayName} />

      <Header>
        <HeaderBackLink />
        <HeaderTitle>
          {displayName ?? <Placeholder $preset="text" />}
        </HeaderTitle>
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

type AnimalProp = { animal: Animal };

function PicturesSection({ animal }: AnimalProp) {
  const picturesId = [animal.avatarId].concat(animal.picturesId);
  return <ImageSlideshow images={picturesId} alt={animal.officialName} />;
}

function HighlightsSection({ animal }: AnimalProp) {
  return (
    <HighlightsSectionElement>
      <StatusBadge status={animal.status} />
    </HighlightsSectionElement>
  );
}

const HighlightsSectionElement = styled.header`
  padding: ${theme.spacing.x4};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function ProfileSection({ animal }: AnimalProp) {
  const speciesLabels = [
    ANIMAL_SPECIES_LABELS[animal.species],
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
              <ItemMainText>{ANIMAL_GENDER_LABELS[animal.gender]}</ItemMainText>
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
                {DateTime.fromISO(animal.birthdate).toLocaleString(
                  DateTime.DATE_FULL
                )}{" "}
                ({formatAge(animal.birthdate)})
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        {animal.iCadNumber != null && (
          <li>
            <Item>
              <ItemIcon>
                <FaFingerprint />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>I-CAD : {animal.iCadNumber}</ItemMainText>
              </ItemContent>
            </Item>
          </li>
        )}
      </ul>
    </SectionBox>
  );
}

function SituationSection({ animal }: AnimalProp) {
  const [areHostFamilyDetailsVisible, setAreHostFamilyDetailsVisible] =
    useState(false);
  const referenceElement = useRef<HTMLButtonElement>(null!);

  return (
    <Section>
      <SectionTitle>Situation</SectionTitle>

      <ul>
        {animal.manager != null && <ManagerItem manager={animal.manager} />}

        <li>
          <Item>
            <ItemIcon>
              <FaCertificate />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                Est <strong>{ANIMAL_STATUS_LABELS[animal.status]}</strong>
                {animal.status === AnimalStatus.ADOPTED &&
                  animal.adoptionDate != null && (
                    <>
                      {" "}
                      depuis le{" "}
                      <strong>
                        {DateTime.fromISO(animal.adoptionDate).toLocaleString(
                          DateTime.DATE_FULL
                        )}
                      </strong>
                    </>
                  )}
                {animal.status === AnimalStatus.ADOPTED &&
                  animal.adoptionOption != null &&
                  animal.adoptionOption !== AdoptionOption.UNKNOWN && (
                    <>
                      {" "}
                      (
                      {ADOPTION_OPTION_LABELS[
                        animal.adoptionOption
                      ].toLowerCase()}
                      )
                    </>
                  )}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        {animal.hostFamily != null && (
          <li>
            <ButtonItem onClick={() => setAreHostFamilyDetailsVisible(true)}>
              <ItemIcon>
                <FaHome />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  En FA chez{" "}
                  <TriggerText ref={referenceElement}>
                    {animal.hostFamily.name}
                  </TriggerText>
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
                le{" "}
                <strong>
                  {DateTime.fromISO(animal.pickUpDate).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </strong>
                {animal.pickUpLocation != null && (
                  <>
                    <br />à <strong>{animal.pickUpLocation}</strong>
                  </>
                )}
                <br />
                suite à{" "}
                <strong>{PICK_UP_REASON_LABELS[animal.pickUpReason]}</strong>
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        {animal.comments != null && (
          <li>
            <Item>
              <ItemIcon>
                <FaExclamationTriangle />
              </ItemIcon>

              <ItemContent>
                <Markdown preset="paragraph">{animal.comments}</Markdown>
              </ItemContent>
            </Item>
          </li>
        )}
      </ul>

      <OtherAnimalsSituations animal={animal} />
    </Section>
  );
}

function ManagerItem({ manager }: { manager: NonNullable<Animal["manager"]> }) {
  const { currentUser } = useCurrentUser();

  if (hasGroups(currentUser, [UserGroup.ADMIN])) {
    return (
      <LinkItem href={`/users/${manager.id}`}>
        <ItemIcon>
          <FaUser />
        </ItemIcon>

        <ItemContent>
          <ItemMainText>
            Est géré par <TriggerText>{manager.displayName}</TriggerText>
          </ItemMainText>
        </ItemContent>
      </LinkItem>
    );
  }

  return (
    <Item>
      <ItemIcon>
        <FaUser />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>
          Est géré par <strong>{manager.displayName}</strong>
        </ItemMainText>
      </ItemContent>
    </Item>
  );
}

function HostFamilyModal({
  hostFamily,
}: {
  hostFamily: NonNullable<Animal["hostFamily"]>;
}) {
  const { currentUser } = useCurrentUser();
  const isCurrentUserAdmin = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

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
              shouldOpenInNewTarget
              href={`http://maps.google.com/?q=${encodeURIComponent(
                hostFamily.formattedAddress
              )}`}
            >
              <ItemIcon>
                <FaMapMarkerAlt />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>{hostFamily.formattedAddress}</ItemMainText>
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
  [Trilean.FALSE]: theme.colors.alert[500],
  [Trilean.TRUE]: theme.colors.success[500],
  [Trilean.UNKNOWN]: "inherit",
};

type OtherAnimalSituationProps = {
  label: string;
  value: Trilean;
};

function OtherAnimalSituation({ label, value }: OtherAnimalSituationProps) {
  return (
    <OtherAnimalSituationListItem>
      <OtherAnimalSituationListItemLabel>
        {label}
      </OtherAnimalSituationListItemLabel>

      <OtherAnimalSituationListItemValue $value={value}>
        {TRILEAN_LABELS[value]}
      </OtherAnimalSituationListItemValue>
    </OtherAnimalSituationListItem>
  );
}

const OtherAnimalSituationListItem = styled.li`
  flex: 1;
  background: ${theme.colors.dark[30]};
  border-radius: ${theme.borderRadius.m};
  padding: ${theme.spacing.x2};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OtherAnimalSituationListItemLabel = styled.span`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

const OtherAnimalSituationListItemValue = styled.span<{ $value: Trilean }>`
  font-weight: 700;
  color: ${(props) => IsOkColors[props.$value]};
`;

function OtherAnimalsSituations({ animal }: AnimalProp) {
  return (
    <OtherAnimalsSituationsList>
      <OtherAnimalSituation label="Ok enfants" value={animal.isOkChildren} />
      <OtherAnimalSituation label="Ok chiens" value={animal.isOkDogs} />
      <OtherAnimalSituation label="Ok chats" value={animal.isOkCats} />
    </OtherAnimalsSituationsList>
  );
}

const OtherAnimalsSituationsList = styled.ul`
  margin-top: ${theme.spacing.x2};
  padding: 0 ${theme.spacing.x2};
  display: flex;
  gap: ${theme.spacing.x2};
`;

const TriggerText = styled.strong`
  color: ${theme.colors.primary[500]};
`;

function DescriptionSection({ animal }: AnimalProp) {
  if (animal.description == null) {
    return null;
  }

  return (
    <Section>
      <SectionTitle>Description</SectionTitle>
      <DescriptionText preset="paragraph">{animal.description}</DescriptionText>
    </Section>
  );
}

const DescriptionText = styled(Markdown)`
  padding: 0 ${theme.spacing.x2};
`;

type DeleteAnimalProp = {
  deleteAnimal: UseMutationResult<void, Error, Animal, unknown>;
};

function ActionsSection({
  animal,
  deleteAnimal,
}: AnimalProp & DeleteAnimalProp) {
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
        <DeleteAnimalButton animal={animal} deleteAnimal={deleteAnimal} />
      </Section>
    </>
  );
}

function DeleteAnimalButton({
  animal,
  deleteAnimal,
}: AnimalProp & DeleteAnimalProp) {
  const { onDismiss } = useModal();

  return (
    <ButtonItem
      onClick={() => {
        if (!deleteAnimal.isLoading) {
          const confirmationMessage = [
            `Êtes-vous sûr de vouloir supprimer ${animal.displayName} ?`,
            "L'action est irréversible.",
          ].join("\n");

          if (window.confirm(confirmationMessage)) {
            onDismiss();
            deleteAnimal.mutate(animal);
          }
        }
      }}
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

import {
  AdoptionOption,
  AdoptionOptionLabels,
  Animal,
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
  PickUpReasonLabels,
  Trilean,
  TrileanLabels,
  UserGroup,
} from "@animeaux/shared-entities";
import { useCurrentUser } from "account/currentUser";
import { AnimalGenderIcon } from "animal/animalGenderIcon";
import { AnimalSpeciesIcon } from "animal/animalSpeciesIcon";
import { useAnimal, useDeleteAnimal } from "animal/queries";
import { StatusBadge } from "animal/status";
import { QuickActions } from "core/actions/quickAction";
import { ImageSlideshow } from "core/dataDisplay/imageSlideshow";
import {
  ButtonItem,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  LinkItem,
} from "core/dataDisplay/item";
import { Markdown } from "core/dataDisplay/markdown";
import { ApplicationLayout } from "core/layouts/applicationLayout";
import { Header, HeaderBackLink, HeaderTitle } from "core/layouts/header";
import { Main } from "core/layouts/main";
import { Navigation } from "core/layouts/navigation";
import { Section, SectionBox, SectionTitle } from "core/layouts/section";
import { Separator } from "core/layouts/separator";
import { PageTitle } from "core/pageTitle";
import {
  Modal,
  ModalHeader,
  ModalHeaderTitle,
  useModal,
} from "core/popovers/modal";
import { renderQueryEntity } from "core/request";
import { useRouter } from "core/router";
import { PageComponent } from "core/types";
import { withConfirmation } from "core/withConfirmation";
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
  FaMapMarker,
  FaPen,
  FaPhone,
  FaTrash,
} from "react-icons/fa";
import styled from "styled-components";
import { theme } from "styles/theme";

type AnimalProps = {
  animal: Animal;
};

function PicturesSection({ animal }: AnimalProps) {
  const picturesId = [animal.avatarId].concat(animal.picturesId);
  return <ImageSlideshow images={picturesId} alt={animal.officialName} />;
}

function HighlightsSection({ animal }: AnimalProps) {
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
              shouldOpenInNewTarget
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
        {TrileanLabels[value]}
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

function OtherAnimalsSituations({ animal }: AnimalProps) {
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

function SituationSection({ animal }: AnimalProps) {
  const [areHostFamilyDetailsVisible, setAreHostFamilyDetailsVisible] =
    useState(false);
  const referenceElement = useRef<HTMLButtonElement>(null!);

  return (
    <Section>
      <SectionTitle>Situation</SectionTitle>

      <ul>
        <li>
          <Item>
            <ItemIcon>
              <FaCertificate />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                Est <strong>{AnimalStatusLabels[animal.status]}</strong>
                {animal.status === AnimalStatus.ADOPTED &&
                  animal.adoptionDate != null && (
                    <>
                      {" "}
                      depuis le{" "}
                      <strong>{formatLongDate(animal.adoptionDate)}</strong>
                    </>
                  )}
                {animal.status === AnimalStatus.ADOPTED &&
                  animal.adoptionOption != null &&
                  animal.adoptionOption !== AdoptionOption.UNKNOWN && (
                    <>
                      {" "}
                      (
                      {AdoptionOptionLabels[
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
                  <HostFamilyName ref={referenceElement}>
                    {animal.hostFamily.name}
                  </HostFamilyName>
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
                {animal.pickUpLocation != null && (
                  <>
                    <br />à <strong>{animal.pickUpLocation}</strong>
                  </>
                )}
                <br />
                suite à{" "}
                <strong>{PickUpReasonLabels[animal.pickUpReason]}</strong>
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

const HostFamilyName = styled.strong`
  color: ${theme.colors.primary[500]};
`;

function DescriptionSection({ animal }: AnimalProps) {
  if (animal.description === "") {
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
          <QuickActions icon={<FaPen />}>
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

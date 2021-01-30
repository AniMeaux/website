import {
  AnimalSpeciesIcon,
  Header,
  HousingTypeIcon,
  useDeleteHostFamily,
  useHostFamily,
  VehicleTypeIcon,
} from "@animeaux/app-core";
import {
  AnimalSpeciesLabels,
  AnimalSpeciesLabelsPlural,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
  getErrorMessage,
  HostFamily,
  HousingTypeLabels,
  isAnimalSpeciesFertile,
  Trilean,
  VehicleTypeLabels,
} from "@animeaux/shared-entities";
import {
  ActionSection,
  ActionSectionList,
  ButtonWithConfirmation,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ItemSecondaryText,
  LinkItem,
  Main,
  Message,
  MessageSection,
  Placeholder,
  Placeholders,
  resolveUrl,
  Section,
  SectionTitle,
  Separator,
} from "@animeaux/ui-library";
import { useRouter } from "next/router";
import * as React from "react";
import {
  FaBaby,
  FaEnvelope,
  FaFacebook,
  FaGoogleDrive,
  FaMapMarker,
  FaPen,
  FaPhone,
  FaTree,
} from "react-icons/fa";
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
              <ItemMainText>{hostFamily.address}</ItemMainText>
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

function HousingAndTransportSection({
  hostFamily,
}: {
  hostFamily: HostFamily;
}) {
  return (
    <Section>
      <SectionTitle>Transport et habitation</SectionTitle>

      <ul>
        {hostFamily.hasVehicle !== Trilean.UNKNOWN && (
          <li>
            <Item>
              <ItemIcon>
                <VehicleTypeIcon hasVehicle={hostFamily.hasVehicle} />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>
                  {VehicleTypeLabels[hostFamily.hasVehicle]}
                </ItemMainText>
              </ItemContent>
            </Item>
          </li>
        )}

        <li>
          <Item>
            <ItemIcon>
              <HousingTypeIcon housingType={hostFamily.housing} />
            </ItemIcon>

            <ItemContent>
              <ItemMainText>
                {HousingTypeLabels[hostFamily.housing]}
              </ItemMainText>
            </ItemContent>
          </Item>
        </li>

        {hostFamily.hasGarden && (
          <li>
            <Item>
              <ItemIcon>
                <FaTree />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>Avec jardin</ItemMainText>
              </ItemContent>
            </Item>
          </li>
        )}
      </ul>
    </Section>
  );
}

function HousingAndTransportPlaceholderSection() {
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

function HomeCompositionSection({ hostFamily }: { hostFamily: HostFamily }) {
  return (
    <Section>
      <SectionTitle>Composition du foyer</SectionTitle>

      {hostFamily.hasChild && (
        <Item>
          <ItemIcon>
            <FaBaby />
          </ItemIcon>

          <ItemContent>
            <ItemMainText>A des enfants en bas âge</ItemMainText>
          </ItemContent>
        </Item>
      )}

      <ul>
        {ANIMAL_SPECIES_ALPHABETICAL_ORDER.map((species) => {
          const count = hostFamily.ownAnimals[species]?.count ?? 0;
          const multiple = count > 1;

          if (count === 0) {
            return null;
          }

          return (
            <li key={species}>
              <Item>
                <ItemIcon>
                  <AnimalSpeciesIcon species={species} />
                </ItemIcon>

                <ItemContent>
                  <ItemMainText>
                    <strong className="font-semibold">{count}</strong>{" "}
                    {multiple
                      ? AnimalSpeciesLabelsPlural[species]
                      : AnimalSpeciesLabels[species]}
                    {isAnimalSpeciesFertile(species) &&
                      hostFamily.ownAnimals[species]!.areAllSterilized &&
                      ` stérélisé${multiple ? "s" : ""}`}
                  </ItemMainText>
                </ItemContent>
              </Item>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function LinksSection({ hostFamily }: { hostFamily: HostFamily }) {
  return (
    <Section>
      <SectionTitle>Liens</SectionTitle>

      <ul>
        {hostFamily.linkToDrive != null && (
          <li>
            <LinkItem
              size="large"
              href={hostFamily.linkToDrive}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ItemIcon>
                <FaGoogleDrive />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>Dossier drive</ItemMainText>
                <ItemSecondaryText>{hostFamily.linkToDrive}</ItemSecondaryText>
              </ItemContent>
            </LinkItem>
          </li>
        )}

        {hostFamily.linkToFacebook != null && (
          <li>
            <LinkItem
              size="large"
              href={hostFamily.linkToFacebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ItemIcon>
                <FaFacebook />
              </ItemIcon>

              <ItemContent>
                <ItemMainText>Page Facebook</ItemMainText>
                <ItemSecondaryText>
                  {hostFamily.linkToFacebook}
                </ItemSecondaryText>
              </ItemContent>
            </LinkItem>
          </li>
        )}
      </ul>
    </Section>
  );
}

function ActionsSection({ hostFamily }: { hostFamily: HostFamily }) {
  const router = useRouter();
  const [deleteHostFamily, deleteHostFamilyRequest] = useDeleteHostFamily(
    () => {
      router.push(resolveUrl(router.asPath, "..?deleteSucceeded"));
    }
  );

  return (
    <ActionSection>
      {deleteHostFamilyRequest.error != null && (
        <Message type="error" className="mb-4">
          {getErrorMessage(deleteHostFamilyRequest.error)}
        </Message>
      )}

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

export default function HostFamilyPage() {
  const router = useRouter();
  const hostFamilyId = router.query.hostFamilyId as string;
  const updateSucceeded = router.query.updateSucceeded != null;
  const [hostFamily, hostFamilyRequest] = useHostFamily(hostFamilyId);

  let pageTitle: string | null = null;
  let headerTitle: React.ReactNode | null = null;

  if (hostFamily != null) {
    pageTitle = hostFamily.name;
    headerTitle = hostFamily.name;
  } else if (hostFamilyRequest.isLoading) {
    headerTitle = <Placeholder preset="text" />;
  } else if (hostFamilyRequest.error != null) {
    headerTitle = "Oups";
    pageTitle = "Oups";
  }

  let content: React.ReactNode | null = null;

  if (hostFamily != null) {
    const hasLink =
      hostFamily.linkToDrive != null || hostFamily.linkToFacebook != null;

    const hasHomeComposition =
      hostFamily.hasChild || Object.keys(hostFamily.ownAnimals).length > 0;

    content = (
      <>
        <ContactSection hostFamily={hostFamily} />
        <Separator />
        <HousingAndTransportSection hostFamily={hostFamily} />

        {hasHomeComposition && (
          <>
            <Separator />
            <HomeCompositionSection hostFamily={hostFamily} />
          </>
        )}

        {hasLink && (
          <>
            <Separator />
            <LinksSection hostFamily={hostFamily} />
          </>
        )}

        <Separator />
        <ActionsSection hostFamily={hostFamily} />
      </>
    );
  } else if (hostFamilyRequest.isLoading) {
    content = (
      <>
        <ContactPlaceholderSection />
        <Separator />
        <HousingAndTransportPlaceholderSection />
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

      <Main>
        {updateSucceeded && (
          <MessageSection>
            <Message type="success">
              La famille d'accueil a bien été modifiée
            </Message>
          </MessageSection>
        )}

        {hostFamilyRequest.error != null && (
          <MessageSection>
            <Message type="error">
              {getErrorMessage(hostFamilyRequest.error)}
            </Message>
          </MessageSection>
        )}

        {content}
      </Main>

      {/* <Navigation hideOnSmallScreen /> */}
    </div>
  );
}

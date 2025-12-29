import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Routes } from "#core/navigation";
import { GENDER_TRANSLATION } from "#exhibitors/dogs-configuration/gender";
import { DogsHelper } from "#exhibitors/dogs-configuration/helper";
import { Icon } from "#generated/icon";
import { joinReactNodes } from "@animeaux/core";
import { Gender, ShowExhibitorStatus } from "@animeaux/prisma";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server.js";
import { SectionId } from "./section-id.js";

export function SectionDogs() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id={SectionId.DOGS}>
      <FormLayout.Header>
        <FormLayout.Title>Chiens sur stand</FormLayout.Title>

        {exhibitor.dogsConfigurationStatus !== ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .participation.editDogs.toString()}
              title="Modifier"
            >
              <Icon id="pen-light" />
            </Link>
          </FormLayout.HeaderAction>
        ) : null}
      </FormLayout.Header>

      <SectionStatus />

      <DogsHelper />

      {exhibitor.dogs.length === 0 ? (
        <LightBoardCard isSmall>
          <p>Aucun chien présent sur le stand.</p>
        </LightBoardCard>
      ) : (
        joinReactNodes(
          exhibitor.dogs.map((dog) => (
            <SectionDog key={dog.idNumber} dog={dog} />
          )),
          <FormLayout.FieldSeparator />,
        )
      )}
    </FormLayout.Section>
  );
}

function SectionDog({
  dog,
}: {
  dog: {
    gender: Gender;
    idNumber: string;
    isCategorized: boolean;
    isSterilized: boolean;
  };
}) {
  return (
    <>
      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Numéro d’identification</FormLayout.Label>

          <FormLayout.Output>{dog.idNumber}</FormLayout.Output>
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>Genre</FormLayout.Label>

          <FormLayout.Output>
            {GENDER_TRANSLATION[dog.gender]}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>
            {dog.gender === Gender.FEMALE
              ? "Elle est stérilisée"
              : "Il est castré"}
          </FormLayout.Label>

          <FormLayout.Output>
            {dog.isSterilized ? "Oui" : "Non"}
          </FormLayout.Output>

          {dog.gender === Gender.FEMALE && !dog.isSterilized ? (
            <FormLayout.Helper variant="error">
              Les femelles en chaleur sont interdites sur le salon
            </FormLayout.Helper>
          ) : null}
        </FormLayout.Field>

        <FormLayout.Field>
          <FormLayout.Label>
            {dog.gender === Gender.FEMALE
              ? "Elle est catégorisée"
              : "Il est catégorisé"}
          </FormLayout.Label>

          <FormLayout.Output>
            {dog.isCategorized ? "Oui" : "Non"}
          </FormLayout.Output>
        </FormLayout.Field>
      </FormLayout.Row>
    </>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.dogsConfigurationStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validé",
    } satisfies Record<typeof exhibitor.dogsConfigurationStatus, string>
  )[exhibitor.dogsConfigurationStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Le profil des chiens sur votre stand est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.dogsConfigurationStatusMessage ??
        "Le profil des chiens sur votre stand nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "Le profil des chiens sur votre stand est validé par notre équipe et aucune modification n’est plus possible. Pour toute question ou besoin particulier, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.dogsConfigurationStatus, string>
  )[exhibitor.dogsConfigurationStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

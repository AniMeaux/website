import { FormLayout } from "#core/layout/form-layout";
import { LightBoardCard } from "#core/layout/light-board-card";
import { GENDER_TRANSLATION } from "#exhibitors/stand-configuration/dog-gender";
import { DogsHelper } from "#exhibitors/stand-configuration/dogs-helper";
import { joinReactNodes } from "@animeaux/core";
import { Gender } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDogs() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Chiens présents</FormLayout.Title>

      <DogsHelper />

      {standConfiguration.presentDogs.length === 0 ? (
        <LightBoardCard isSmall>
          <p>Aucun chien présent sur le stand.</p>
        </LightBoardCard>
      ) : (
        joinReactNodes(
          standConfiguration.presentDogs.map((dog) => (
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
      <FormLayout.Field>
        <FormLayout.Label>Numéro d’identification</FormLayout.Label>

        <FormLayout.Output>{dog.idNumber}</FormLayout.Output>
      </FormLayout.Field>

      <FormLayout.Field>
        <FormLayout.Label>Genre</FormLayout.Label>

        <FormLayout.Output>{GENDER_TRANSLATION[dog.gender]}</FormLayout.Output>
      </FormLayout.Field>

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

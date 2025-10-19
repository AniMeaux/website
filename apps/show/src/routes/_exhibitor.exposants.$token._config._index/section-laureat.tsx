import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionLaureat() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const isLaureat = exhibitor.isOrganizersFavorite || exhibitor.isRisingStar;

  if (!isLaureat) {
    return null;
  }

  return (
    <>
      <FormLayout.Section>
        <FormLayout.Title>Lauréat</FormLayout.Title>

        <HelperOrganizersFavorite />
        <HelperRisingStar />
      </FormLayout.Section>

      <FormLayout.SectionSeparator />
    </>
  );
}

function HelperOrganizersFavorite() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (!exhibitor.isOrganizersFavorite) {
    return null;
  }

  return (
    <HelperCard.Root color="alabaster">
      <HelperCard.Title>Coup de cœur</HelperCard.Title>

      <p>
        Félicitations ! Votre stand est offert.
        <br />
        Cette offre concerne uniquement le tarif du stand, hors options
        supplémentaires et sponsoring. Merci de finaliser vos options et
        documents dans votre espace exposant afin de confirmer votre
        participation.
      </p>
    </HelperCard.Root>
  );
}

function HelperRisingStar() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (!exhibitor.isRisingStar) {
    return null;
  }

  return (
    <HelperCard.Root color="alabaster">
      <HelperCard.Title>Espoir</HelperCard.Title>

      <p>
        Bravo ! Une remise de -30 % est appliquée sur votre stand.
        <br />
        Cette réduction s’applique uniquement au tarif du stand, hors options
        supplémentaires et sponsoring. Pensez à compléter vos options et
        documents dans votre espace exposant pour valider votre inscription.
      </p>
    </HelperCard.Root>
  );
}

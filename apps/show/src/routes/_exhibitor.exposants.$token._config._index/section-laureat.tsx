import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function SectionLaureat() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const isLaureat = exhibitor.isOrganizersFavorite;

  if (!isLaureat) {
    return null;
  }

  return (
    <>
      <FormLayout.Section>
        <FormLayout.Title>Lauréat</FormLayout.Title>

        <HelperOrganizersFavorite />
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

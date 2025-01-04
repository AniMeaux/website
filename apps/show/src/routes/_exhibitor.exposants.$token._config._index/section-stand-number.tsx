import { HelperCard } from "#core/layout/helper-card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionStandNumber() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  if (standConfiguration.standNumber == null) {
    return null;
  }

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>
        Stand nº{standConfiguration.standNumber}
      </HelperCard.Title>

      <p>
        Votre numéro de stand est défini et vous pourrez l’utiliser pour vous
        repérer sur le plan du salon. Des modifications de placement restent
        néanmoins possibles en fonction des aléas d’organisation.
      </p>
    </HelperCard.Root>
  );
}

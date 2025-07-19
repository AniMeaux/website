import { HelperCard } from "#core/layout/helper-card";
import { ShowExhibitorStatus } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionPayment() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.hasPaid) {
    return (
      <HelperCard.Root color="paleBlue">
        <HelperCard.Title>Paiement validé</HelperCard.Title>

        <p>
          Le règlement des frais de tenue de stand a été validé. Votre
          inscription est désormais confirmée.
        </p>
      </HelperCard.Root>
    );
  }

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    return (
      <HelperCard.Root color="paleBlue">
        <HelperCard.Title>En attente de paiement</HelperCard.Title>

        <p>
          Le règlement des frais de tenue de stand est actuellement en attente.
          Votre inscription sera définitivement validée après réception du
          paiement, pouvant être effectué par carte bancaire ou virement
          bancaire.
        </p>
      </HelperCard.Root>
    );
  }

  return null;
}

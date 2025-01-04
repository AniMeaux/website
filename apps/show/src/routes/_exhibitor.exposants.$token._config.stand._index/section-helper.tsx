import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation";
import { ShowExhibitorStandConfigurationStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionHelper() {
  const { standConfiguration, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.AsideHelper.Root>
      <p>
        Le montant de votre stand dépend de sa{" "}
        <strong className="text-body-lowercase-emphasis">taille</strong> et de
        votre{" "}
        <strong className="text-body-lowercase-emphasis">
          domaine d’activité
        </strong>
        .
      </p>

      <p>
        Une fois la configuration de votre stand validée par notre équipe, vous
        recevrez par e-mail les informations de paiement.
      </p>

      <p>
        Le règlement pourra être effectué par{" "}
        <strong className="text-body-lowercase-emphasis">
          virement bancaire
        </strong>{" "}
        ou{" "}
        <strong className="text-body-lowercase-emphasis">carte bancaire</strong>
        .
      </p>

      <p>
        Votre inscription sera définitivement confirmée après réception de votre
        paiement.
      </p>

      {standConfiguration.status !==
      ShowExhibitorStandConfigurationStatus.VALIDATED ? (
        <FormLayout.AsideHelper.Action asChild>
          <Link to={Routes.exhibitors.token(token).stand.edit.toString()}>
            Modifier
          </Link>
        </FormLayout.AsideHelper.Action>
      ) : null}
    </FormLayout.AsideHelper.Root>
  );
}

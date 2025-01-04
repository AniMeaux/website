import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation";
import { ShowExhibitorDocumentsStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionHelper() {
  const { documents, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.AsideHelper.Root>
      <p>
        La fourniture des documents demandés est obligatoire pour valider votre
        dossier et confirmer votre participation au Salon des Ani'Meaux 2025.
      </p>

      <p>
        Vous devez notamment fournir un justificatif d’immatriculation (Kbis,
        récépissé d’association ou SIRENE) et une attestation d’Assurance
        Responsabilité Civile Professionnelle couvrant tout dommage éventuel
        durant l’événement.
      </p>

      <p>
        Merci de vérifier que vos fichiers sont lisibles et à jour avant de les
        télécharger.
      </p>

      <p>
        Pour toute question, contactez-nous à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </p>

      {documents.status !== ShowExhibitorDocumentsStatus.VALIDATED ? (
        <FormLayout.AsideHelper.Action asChild>
          <Link to={Routes.exhibitors.token(token).documents.edit.toString()}>
            Modifier
          </Link>
        </FormLayout.AsideHelper.Action>
      ) : null}
    </FormLayout.AsideHelper.Root>
  );
}

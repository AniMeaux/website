import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root hideOnSmallScreens>
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
    </FormLayout.AsideHelper.Root>
  );
}

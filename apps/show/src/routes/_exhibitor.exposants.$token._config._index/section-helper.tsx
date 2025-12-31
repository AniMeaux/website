import { ProseInlineAction } from "#i/core/actions/prose-inline-action";
import { FormLayout } from "#i/core/layout/form-layout";

export function SectionHelper() {
  return (
    <FormLayout.AsideHelper.Root>
      <p>Bienvenue sur votre tableau de bord exposant !</p>

      <p>
        Vous trouverez ici un récapitulatif complet de l’état d’avancement de
        votre inscription.
      </p>

      <p>
        Suivez facilement la validation de vos documents, le statut de votre
        stand et vos informations pratiques.
      </p>

      <p>
        Pour toute question ou mise à jour, n’hésitez pas à nous contacter à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </p>
    </FormLayout.AsideHelper.Root>
  );
}

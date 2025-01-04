import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { HelperCard } from "#core/layout/helper-card";
import { canEditProfile } from "#exhibitors/profile/dates";

export function SectionStatus() {
  if (canEditProfile()) {
    return null;
  }

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>Profil vérouillé</HelperCard.Title>

      <p>
        Votre profil ne peut plus être modifié, la date du salon approchant à
        grands pas. Pour toute question urgente, merci de nous contacter par
        e-mail à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </p>
    </HelperCard.Root>
  );
}

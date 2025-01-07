import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Routes } from "#core/navigation";
import { CardAnimationsOnStand } from "#exhibitors/profile/card-animations-on-stand";
import { canEditProfile } from "#exhibitors/profile/dates";
import { Icon } from "#generated/icon";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionOnStand() {
  const { profile, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Animations sur stand</FormLayout.Title>

        {canEditProfile() ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors.token(token).animations.edit.toString()}
              title="Modifier"
            >
              <Icon id="pen-light" />
            </Link>
          </FormLayout.HeaderAction>
        ) : null}
      </FormLayout.Header>

      <StatusHelper />

      {profile.onStandAnimations == null ? (
        <LightBoardCard isSmall>
          <p>Aucune animation sur stand prévue.</p>
        </LightBoardCard>
      ) : (
        <FormLayout.Row>
          <FormLayout.Field>
            <FormLayout.Label>Description</FormLayout.Label>

            <FormLayout.Output>{profile.onStandAnimations}</FormLayout.Output>
          </FormLayout.Field>

          <FormLayout.Field>
            <FormLayout.Label>Aperçu</FormLayout.Label>

            <CardAnimationsOnStand
              onStandAnimations={profile.onStandAnimations}
            />
          </FormLayout.Field>
        </FormLayout.Row>
      )}
    </FormLayout.Section>
  );
}

function StatusHelper() {
  if (canEditProfile()) {
    return (
      <HelperCard.Root color="paleBlue">
        <p>
          Vous avez la possibilité d’organiser une animation sur votre stand
          (atelier, offre promotionnelle spéciale, ou encore un reversement
          d’une partie de vos ventes à l’association, etc…).
        </p>

        <p>
          Vous pouvez renseigner toutes les informations concernant votre
          animation afin de faciliter sa mise en avant et son organisation.
        </p>

        <p>
          N’oubliez pas d’ajouter le lien vers le système d’inscription le cas
          échéant !
        </p>
      </HelperCard.Root>
    );
  }

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>Animations vérouillés</HelperCard.Title>

      <p>
        Le salon approchant à grands pas, il n’est désormais plus possible de
        modifier ou d’ajouter une animation. Pour toute question urgente, vous
        pouvez nous contacter à{" "}
        <ProseInlineAction asChild>
          <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
        </ProseInlineAction>
        .
      </p>
    </HelperCard.Root>
  );
}

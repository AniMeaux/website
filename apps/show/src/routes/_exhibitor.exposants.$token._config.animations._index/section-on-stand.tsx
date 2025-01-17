import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Routes } from "#core/navigation";
import { CardAnimationsOnStand } from "#exhibitors/profile/card-animations-on-stand";
import { Icon } from "#generated/icon";
import { ShowExhibitorProfileStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionOnStand() {
  const { profile, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id="on-stand-animations">
      <FormLayout.Header>
        <FormLayout.Title>Animations sur stand</FormLayout.Title>

        {profile.onStandAnimationsStatus !==
        ShowExhibitorProfileStatus.VALIDATED ? (
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

      <SectionStatus />

      <HelperCard.Root color="alabaster">
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

function SectionStatus() {
  const { profile } = useLoaderData<typeof loader>();

  if (
    profile.onStandAnimationsStatus === ShowExhibitorProfileStatus.NOT_TOUCHED
  ) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "En cours de traitement",
      [ShowExhibitorProfileStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorProfileStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof profile.onStandAnimationsStatus, string>
  )[profile.onStandAnimationsStatus];

  const content = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "La description de vos animations sur stand est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorProfileStatus.TO_MODIFY]:
        profile.onStandAnimationsStatusMessage ??
        "La description de vos animations sur stand nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorProfileStatus.VALIDATED]:
        "La description de vos animations sur stand est complétée et validée par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof profile.onStandAnimationsStatus, string>
  )[profile.onStandAnimationsStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

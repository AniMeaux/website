import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Routes } from "#core/navigation";
import { CardAnimationsOnStand } from "#exhibitors/animations/card-animations-on-stand";
import { Icon } from "#generated/icon";
import { ShowExhibitorStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";
import { SectionId } from "./section-id";

export function SectionOnStandAnimations() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id={SectionId.ON_STAND_ANIMATIONS}>
      <FormLayout.Header>
        <FormLayout.Title>Animations sur stand</FormLayout.Title>

        {exhibitor.onStandAnimationsStatus !== ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .participation.editAnimations.toString()}
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

      {exhibitor.onStandAnimations == null ? (
        <LightBoardCard isSmall>
          <p>Aucune animation sur stand prévue.</p>
        </LightBoardCard>
      ) : (
        <FormLayout.Row>
          <FormLayout.Field>
            <FormLayout.Label>Description</FormLayout.Label>

            <FormLayout.Output>{exhibitor.onStandAnimations}</FormLayout.Output>
          </FormLayout.Field>

          <FormLayout.Field>
            <FormLayout.Label>Aperçu</FormLayout.Label>

            <CardAnimationsOnStand
              onStandAnimations={exhibitor.onStandAnimations}
            />
          </FormLayout.Field>
        </FormLayout.Row>
      )}
    </FormLayout.Section>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.onStandAnimationsStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof exhibitor.onStandAnimationsStatus, string>
  )[exhibitor.onStandAnimationsStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "La description de vos animations sur stand est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.onStandAnimationsStatusMessage ??
        "La description de vos animations sur stand nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "La description de vos animations sur stand est complétée et validée par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.onStandAnimationsStatus, string>
  )[exhibitor.onStandAnimationsStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

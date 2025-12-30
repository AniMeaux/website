import { Markdown, PARAGRAPH_COMPONENTS } from "#i/core/data-display/markdown";
import { FormLayout } from "#i/core/layout/form-layout";
import { HelperCard } from "#i/core/layout/helper-card";
import { LightBoardCard } from "#i/core/layout/light-board-card";
import { Routes } from "#i/core/navigation";
import { Icon } from "#i/generated/icon";
import { ShowExhibitorStatus } from "@animeaux/prisma";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDescription() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id="description">
      <FormLayout.Header>
        <FormLayout.Title>Description</FormLayout.Title>

        {exhibitor.descriptionStatus !== ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .profile.editDescription.toString()}
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
          Cette description nous servira de base pour nos publications sur les
          réseaux sociaux.
        </p>
      </HelperCard.Root>

      <LightBoardCard isSmall>
        {exhibitor.description != null ? (
          <Markdown
            content={exhibitor.description}
            components={PARAGRAPH_COMPONENTS}
            className="block"
          />
        ) : (
          <p className="text-center">Aucune description</p>
        )}
      </LightBoardCard>
    </FormLayout.Section>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.descriptionStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof exhibitor.descriptionStatus, string>
  )[exhibitor.descriptionStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Votre description est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.descriptionStatusMessage ??
        "Votre description nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "Votre description est complétée et validée par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.descriptionStatus, string>
  )[exhibitor.descriptionStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

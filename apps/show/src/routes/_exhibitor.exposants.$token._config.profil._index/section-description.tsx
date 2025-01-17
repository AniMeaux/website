import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { ShowExhibitorProfileStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDescription() {
  const { profile, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id="description">
      <FormLayout.Header>
        <FormLayout.Title>Description</FormLayout.Title>

        {profile.descriptionStatus !== ShowExhibitorProfileStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(token)
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
        {profile.description != null ? (
          <Markdown
            content={profile.description}
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
  const { profile } = useLoaderData<typeof loader>();

  if (profile.descriptionStatus === ShowExhibitorProfileStatus.NOT_TOUCHED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "En cours de traitement",
      [ShowExhibitorProfileStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorProfileStatus.VALIDATED]: "Validée",
    } satisfies Record<typeof profile.descriptionStatus, string>
  )[profile.descriptionStatus];

  const content = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "Votre description est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorProfileStatus.TO_MODIFY]:
        profile.descriptionStatusMessage ??
        "Votre description nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorProfileStatus.VALIDATED]:
        "Votre description est complétée et validée par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof profile.descriptionStatus, string>
  )[profile.descriptionStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

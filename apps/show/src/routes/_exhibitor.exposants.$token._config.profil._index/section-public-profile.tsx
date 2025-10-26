import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { ChipList } from "#core/data-display/chip";
import { DynamicImage } from "#core/data-display/image";
import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { ImageData } from "#core/image/data.js";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { ChipActivityField } from "#exhibitors/activity-field/chip";
import { ChipActivityTarget } from "#exhibitors/activity-target/chip";
import { Icon } from "#generated/icon";
import { joinReactNodes } from "@animeaux/core";
import { ShowExhibitorStatus } from "@animeaux/prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionPublicProfile() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Profil public</FormLayout.Title>

        {exhibitor.publicProfileStatus !== ShowExhibitorStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(exhibitor.token)
                .profile.editPublicProfile.toString()}
              title="Modifier"
            >
              <Icon id="pen-light" />
            </Link>
          </FormLayout.HeaderAction>
        ) : null}
      </FormLayout.Header>

      <SectionStatus />

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Logo</FormLayout.Label>

          <DynamicImage
            alt={exhibitor.name}
            aspectRatio="4:3"
            fallbackSize="512"
            image={ImageData.parse(exhibitor.logoPath)}
            fillTransparentBackground
            objectFit="contain"
            sizes={{ default: "100vw", md: "33vw", lg: "400px" }}
            loading="eager"
            className="w-full rounded-2 border border-alabaster"
          />
        </FormLayout.Field>

        <div className="grid grid-cols-1 gap-2">
          <FormLayout.Field>
            <FormLayout.Label>Cibles</FormLayout.Label>

            <ChipList asChild>
              <FormLayout.Output>
                {exhibitor.activityTargets.map((activityTarget) => (
                  <ChipActivityTarget
                    key={activityTarget}
                    activityTarget={activityTarget}
                  />
                ))}
              </FormLayout.Output>
            </ChipList>
          </FormLayout.Field>

          <FormLayout.Field>
            <FormLayout.Label>Domaines d’activités</FormLayout.Label>

            <ChipList asChild>
              <FormLayout.Output>
                {exhibitor.activityFields.map((activityField) => (
                  <ChipActivityField
                    key={activityField}
                    activityField={activityField}
                  />
                ))}
              </FormLayout.Output>
            </ChipList>
          </FormLayout.Field>
        </div>
      </FormLayout.Row>

      <FormLayout.Field>
        <FormLayout.Label>
          Liens du site internet ou réseaux sociaux
        </FormLayout.Label>

        <FormLayout.Output>
          {joinReactNodes(
            exhibitor.links.map((link) => (
              <ProseInlineAction key={link} variant="subtle" asChild>
                <a href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
              </ProseInlineAction>
            )),
            <br />,
          )}
        </FormLayout.Output>
      </FormLayout.Field>
    </FormLayout.Section>
  );
}

function SectionStatus() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.publicProfileStatus === ShowExhibitorStatus.TO_BE_FILLED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]: "En cours de traitement",
      [ShowExhibitorStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorStatus.VALIDATED]: "Validé",
    } satisfies Record<typeof exhibitor.publicProfileStatus, string>
  )[exhibitor.publicProfileStatus];

  const content = (
    {
      [ShowExhibitorStatus.AWAITING_VALIDATION]:
        "Votre profil public est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorStatus.TO_MODIFY]:
        exhibitor.publicProfileStatusMessage ??
        "Votre profil public nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorStatus.VALIDATED]:
        "Votre profil public est complété et validé par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof exhibitor.publicProfileStatus, string>
  )[exhibitor.publicProfileStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { ChipList } from "#core/data-display/chip";
import { DynamicImage } from "#core/data-display/image";
import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Routes } from "#core/navigation";
import { ChipActivityField } from "#exhibitors/activity-field/chip";
import { ChipActivityTarget } from "#exhibitors/activity-target/chip";
import { Icon } from "#generated/icon";
import { ImageUrl, joinReactNodes } from "@animeaux/core";
import { ShowExhibitorProfileStatus } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionPublicProfile() {
  const { profile, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Profil public</FormLayout.Title>

        {profile.publicProfileStatus !==
        ShowExhibitorProfileStatus.VALIDATED ? (
          <FormLayout.HeaderAction asChild>
            <Link
              to={Routes.exhibitors
                .token(token)
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
            alt={profile.name}
            aspectRatio="4:3"
            fallbackSize="512"
            image={ImageUrl.parse(profile.logoPath)}
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
                {profile.activityTargets.map((activityTarget) => (
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
                {profile.activityFields.map((activityField) => (
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
            profile.links.map((link) => (
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
  const { profile } = useLoaderData<typeof loader>();

  if (profile.publicProfileStatus === ShowExhibitorProfileStatus.NOT_TOUCHED) {
    return null;
  }

  const title = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "En cours de traitement",
      [ShowExhibitorProfileStatus.TO_MODIFY]: "À modifier",
      [ShowExhibitorProfileStatus.VALIDATED]: "Validé",
    } satisfies Record<typeof profile.publicProfileStatus, string>
  )[profile.publicProfileStatus];

  const content = (
    {
      [ShowExhibitorProfileStatus.AWAITING_VALIDATION]:
        "Votre profil public est en cours de traitement par notre équipe. Pour toute question, vous pouvez nous contacter par e-mail à salon@animeaux.org.",
      [ShowExhibitorProfileStatus.TO_MODIFY]:
        profile.publicProfileStatusMessage ??
        "Votre profil public nécessite quelques modifications. Nous vous invitons à les apporter rapidement et à nous contacter par e-mail à salon@animeaux.org pour toute question.",
      [ShowExhibitorProfileStatus.VALIDATED]:
        "Votre profil public est complété et validé par notre équipe. Pour toute demande de modification, merci de nous contacter par e-mail à salon@animeaux.org.",
    } satisfies Record<typeof profile.publicProfileStatus, string>
  )[profile.publicProfileStatus];

  return (
    <HelperCard.Root color="paleBlue">
      <HelperCard.Title>{title}</HelperCard.Title>

      <div>
        <Markdown content={content} components={PARAGRAPH_COMPONENTS} />
      </div>
    </HelperCard.Root>
  );
}

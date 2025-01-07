import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { ChipList } from "#core/data-display/chip";
import { DynamicImage } from "#core/data-display/image";
import { FormLayout } from "#core/layout/form-layout";
import { Routes } from "#core/navigation";
import { ChipActivityField } from "#exhibitors/activity-field/chip";
import { ChipActivityTarget } from "#exhibitors/activity-target/chip";
import { canEditProfile } from "#exhibitors/profile/dates";
import { Icon } from "#generated/icon";
import { ImageUrl, joinReactNodes } from "@animeaux/core";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionPublicProfile() {
  const { profile, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Profil public</FormLayout.Title>

        {canEditProfile() ? (
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

      <FormLayout.Row>
        <FormLayout.Field>
          <FormLayout.Label>Logo</FormLayout.Label>

          <DynamicImage
            alt={profile.name}
            aspectRatio="4:3"
            fallbackSize="512"
            image={ImageUrl.parse(profile.logoPath)}
            objectFit="cover"
            sizes={{ default: "100vw", md: "33vw", lg: "400px" }}
            loading="eager"
            className="w-full rounded-2 border border-mystic-200"
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
              <ProseInlineAction key={link} asChild>
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

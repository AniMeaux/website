import { Markdown, PARAGRAPH_COMPONENTS } from "#core/data-display/markdown";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Routes } from "#core/navigation";
import { canEditProfile } from "#exhibitors/profile/dates";
import { Icon } from "#generated/icon";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function SectionDescription() {
  const { profile, token } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Description</FormLayout.Title>

        {canEditProfile() ? (
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

      <HelperCard.Root color="paleBlue">
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

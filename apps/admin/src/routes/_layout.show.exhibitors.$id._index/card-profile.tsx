import { ProseInlineAction } from "#core/actions";
import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { TRANSLATION_BY_ACTIVITY_FIELD } from "#show/exhibitors/activity-field/translation";
import { TRANSLATION_BY_ACTIVITY_TARGET } from "#show/exhibitors/activity-target/translation";
import {
  PROFILE_STATUS_TRANSLATION,
  ProfileStatusIcon,
} from "#show/exhibitors/profile/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { ImageUrl, joinReactNodes } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardProfile() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profil public</Card.Title>
      </Card.Header>

      <Card.Content>
        <PublicProfileStatusHelper />

        <DynamicImage
          imageId={ImageUrl.parse(profile.logoPath).id}
          alt={profile.name}
          sizeMapping={{ default: "160px", sm: "100vw", md: "33vw" }}
          fallbackSize="512"
          background="none"
          className="w-full rounded-2 border border-gray-200"
        />

        <ItemList>
          <SimpleItem
            isLightIcon
            icon={<Icon href="icon-bullseye-arrow-light" />}
          >
            {profile.activityTargets
              .map((target) => TRANSLATION_BY_ACTIVITY_TARGET[target])
              .join(", ")}
          </SimpleItem>

          <SimpleItem isLightIcon icon={<Icon href="icon-tags-light" />}>
            {profile.activityFields
              .map((field) => TRANSLATION_BY_ACTIVITY_FIELD[field])
              .join(", ")}
          </SimpleItem>

          <SimpleItem isLightIcon icon={<Icon href="icon-globe-light" />}>
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
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function PublicProfileStatusHelper() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ProfileStatusIcon status={profile.publicProfileStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {PROFILE_STATUS_TRANSLATION[profile.publicProfileStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {profile.publicProfileStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {profile.publicProfileStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

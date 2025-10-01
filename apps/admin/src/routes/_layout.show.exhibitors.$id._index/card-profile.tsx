import { Action, ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { ExhibitorCategory } from "#show/exhibitors/category.js";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { ExhibitorStatusIcon } from "#show/exhibitors/status-icon.js";
import { ImageUrl, joinReactNodes } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardProfile() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profil public</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.publicProfile.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <PublicProfileStatusHelper />

        <DynamicImage
          imageId={ImageUrl.parse(exhibitor.logoPath).id}
          alt={exhibitor.name}
          sizeMapping={{ default: "160px", sm: "100vw", md: "33vw" }}
          fallbackSize="512"
          background="none"
          className="w-full rounded-2 border border-gray-200"
        />

        <ItemList>
          <ItemActivityTargets />
          <ItemCategory />
          <ItemActivityFields />
          <ItemLinks />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemActivityFields() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-tags-light" />}>
      {exhibitor.activityFields
        .map((field) => ActivityField.translation[field])
        .join(", ")}
    </SimpleItem>
  );
}

function ItemActivityTargets() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-bullseye-arrow-light" />}>
      {exhibitor.activityTargets
        .map((target) => ActivityTarget.translation[target])
        .join(", ")}
    </SimpleItem>
  );
}

function ItemCategory() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-tag-light" />}>
      {ExhibitorCategory.translation[exhibitor.category]}
    </SimpleItem>
  );
}

function PublicProfileStatusHelper() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ExhibitorStatusIcon status={exhibitor.publicProfileStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.publicProfileStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.publicProfileStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.publicProfileStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

function ItemLinks() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-globe-light" />}>
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
    </SimpleItem>
  );
}

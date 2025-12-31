import { ActivityAction } from "#i/activity/action.js";
import { ActivityActorType } from "#i/activity/actor-type.js";
import { ActivityResource } from "#i/activity/resource.js";
import { AnimalAvatar } from "#i/animals/avatar.js";
import { getAnimalDisplayName } from "#i/animals/profile/name.js";
import { ProseInlineAction } from "#i/core/actions.js";
import { BaseLink } from "#i/core/base-link.js";
import { ItemList, SimpleItem } from "#i/core/data-display/item.js";
import { getShortUuid } from "#i/core/id.js";
import { Card } from "#i/core/layout/card.js";
import { Routes } from "#i/core/navigation.js";
import { FosterFamilyAvatar } from "#i/foster-families/avatar.js";
import { Icon } from "#i/generated/icon.js";
import { UserAvatar } from "#i/users/avatar.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardDetails() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Détails</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemActor />
          <ItemAction />
          <ItemResource />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemActor() {
  const { activity } = useLoaderData<typeof loader>();

  if (activity.user != null) {
    return (
      <SimpleItem icon={<UserAvatar size="sm" user={activity.user} />}>
        <ProseInlineAction asChild>
          <BaseLink to={Routes.users.id(activity.user.id).toString()}>
            {activity.user.displayName}
          </BaseLink>
        </ProseInlineAction>
      </SimpleItem>
    );
  }

  if (activity.actorType === ActivityActorType.Enum.USER) {
    return (
      <SimpleItem icon={<Icon href="icon-user-solid" />}>
        Utilisateur ({getShortUuid(activity.actorId)})
      </SimpleItem>
    );
  }

  return (
    <SimpleItem icon={<span>🤖</span>}>Cron ({activity.actorId})</SimpleItem>
  );
}

function ItemAction() {
  const { activity } = useLoaderData<typeof loader>();

  return (
    <SimpleItem icon={<Icon href={ActivityAction.icon[activity.action]} />}>
      {ActivityAction.translations[activity.action]}
    </SimpleItem>
  );
}

function ItemResource() {
  const { activity } = useLoaderData<typeof loader>();

  if (activity.animal != null) {
    return (
      <SimpleItem icon={<AnimalAvatar size="sm" animal={activity.animal} />}>
        <ProseInlineAction asChild>
          <BaseLink to={Routes.animals.id(activity.animal.id).toString()}>
            {getAnimalDisplayName(activity.animal)}
          </BaseLink>
        </ProseInlineAction>
      </SimpleItem>
    );
  }

  if (activity.fosterFamily != null) {
    return (
      <SimpleItem
        icon={
          <FosterFamilyAvatar
            size="sm"
            availability={activity.fosterFamily.availability}
          />
        }
      >
        <ProseInlineAction asChild>
          <BaseLink
            to={Routes.fosterFamilies.id(activity.fosterFamily.id).toString()}
          >
            {activity.fosterFamily.displayName}
          </BaseLink>
        </ProseInlineAction>
      </SimpleItem>
    );
  }

  return (
    <SimpleItem icon={<Icon href={ActivityResource.icon[activity.resource]} />}>
      {ActivityResource.translations[activity.resource]} (
      {getShortUuid(activity.resourceId)})
    </SimpleItem>
  );
}

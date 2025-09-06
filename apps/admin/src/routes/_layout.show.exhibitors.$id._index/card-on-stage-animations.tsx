import { ProseInlineAction } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { Empty } from "#core/data-display/empty";
import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown.js";
import { Card } from "#core/layout/card";
import { Separator } from "#core/layout/separator.js";
import { Routes } from "#core/navigation.js";
import { Icon } from "#generated/icon.js";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target.js";
import { StandZone } from "#show/exhibitors/stand-configuration/stand-zone.js";
import { joinReactNodes } from "@animeaux/core";
import type { SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function CardOnStageAnimations() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Animations sur scène</Card.Title>
      </Card.Header>

      <Card.Content>
        {exhibitor.animations.length === 0 ? (
          <Empty.Root>
            <Empty.Content>
              <Empty.Message>Aucune animation sur scène prévue.</Empty.Message>
            </Empty.Content>
          </Empty.Root>
        ) : (
          joinReactNodes(
            exhibitor.animations.map((animation) => (
              <AnimationListItem key={animation.id} animation={animation} />
            )),
            <Separator />,
          )
        )}
      </Card.Content>
    </Card>
  );
}

type Animation = SerializeFrom<
  typeof loader
>["exhibitor"]["animations"][number];

function AnimationListItem({ animation }: { animation: Animation }) {
  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
        <ItemList>
          <ItemDates animation={animation} />
          <ItemZone animation={animation} />
          <ItemTargets animation={animation} />
        </ItemList>

        <ItemList>
          <ItemOtherAnimators animation={animation} />
          <ItemRegistrationUrl animation={animation} />
        </ItemList>
      </div>

      <p className="px-1">
        <Markdown components={SENTENCE_COMPONENTS}>
          {animation.description}
        </Markdown>
      </p>
    </div>
  );
}

function ItemDates({ animation }: { animation: Animation }) {
  const startTime = DateTime.fromISO(animation.startTime);

  const duration = DateTime.fromISO(animation.endTime).diff(
    startTime,
    "minutes",
  );

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-calendar-day-light" />}>
      <span className="capitalize">
        {startTime.toLocaleString({
          weekday: "long",
          hour: "numeric",
          minute: "numeric",
        })}
      </span>
      {" • "}
      {duration.toHuman({ unitDisplay: "short" })}
    </SimpleItem>
  );
}

function ItemZone({ animation }: { animation: Animation }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-location-dot-light" />}>
      {StandZone.translation[animation.zone]}
    </SimpleItem>
  );
}

function ItemTargets({ animation }: { animation: Animation }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-bullseye-arrow-light" />}>
      {animation.targets
        .map((target) => ActivityTarget.translation[target])
        .join(", ")}
    </SimpleItem>
  );
}

function ItemOtherAnimators({ animation }: { animation: Animation }) {
  const { exhibitor } = useLoaderData<typeof loader>();

  const otherAnimators = animation.animators.filter(
    (animator) => animator.id !== exhibitor.id,
  );

  if (otherAnimators.length === 0) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-store-light" />}>
      Avec :{" "}
      {joinReactNodes(
        otherAnimators.map((animator) => (
          <ProseInlineAction key={animator.id} variant="normal" asChild>
            <BaseLink to={Routes.show.exhibitors.id(animator.id).toString()}>
              {animator.name}
            </BaseLink>
          </ProseInlineAction>
        )),
        ", ",
      )}
    </SimpleItem>
  );
}

function ItemRegistrationUrl({ animation }: { animation: Animation }) {
  if (animation.registrationUrl == null) {
    return null;
  }

  return (
    <SimpleItem
      isLightIcon
      icon={<Icon href="icon-arrow-up-right-from-square-light" />}
    >
      Voir le{" "}
      <ProseInlineAction variant="normal" asChild>
        <a href={animation.registrationUrl} target="_blank" rel="noreferrer">
          formulaire d’inscription
        </a>
      </ProseInlineAction>
    </SimpleItem>
  );
}

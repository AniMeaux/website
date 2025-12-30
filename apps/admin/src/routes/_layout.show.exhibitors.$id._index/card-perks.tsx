import { Action } from "#i/core/actions.js";
import { BaseLink } from "#i/core/base-link.js";
import { InlineHelper } from "#i/core/data-display/helper.js";
import { ItemList, SimpleItem } from "#i/core/data-display/item";
import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation.js";
import { Icon } from "#i/generated/icon";
import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { StatusHelper } from "#i/show/exhibitors/status-helper";
import { ExhibitorStatusIcon } from "#i/show/exhibitors/status-icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardPerks() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const hasTooManyPeopleForBreakfastSaturday =
    exhibitor.breakfastPeopleCountSaturday > exhibitor.peopleCount;

  const hasTooManyPeopleForBreakfastSunday =
    exhibitor.breakfastPeopleCountSunday > exhibitor.peopleCount;

  const hasTooManyPeopleForAppetizer =
    exhibitor.appetizerPeopleCount > exhibitor.peopleCount;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Avantages</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors.id(exhibitor.id).edit.perks.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        {hasTooManyPeopleForBreakfastSaturday ? (
          <InlineHelper variant="warning">
            Le nombre de personnes pour le petit-déjeuner de samedi dépasse le
            nombre de personne sur le stand ({exhibitor.peopleCount} maximum).
          </InlineHelper>
        ) : null}

        {hasTooManyPeopleForBreakfastSunday ? (
          <InlineHelper variant="warning">
            Le nombre de personnes pour le petit-déjeuner de dimanche dépasse le
            nombre de personne sur le stand ({exhibitor.peopleCount} maximum).
          </InlineHelper>
        ) : null}

        {hasTooManyPeopleForAppetizer ? (
          <InlineHelper variant="warning">
            Le nombre de personnes pour le verre de l’amitié du samedi soir
            dépasse le nombre de personne sur le stand ({exhibitor.peopleCount}{" "}
            maximum).
          </InlineHelper>
        ) : null}

        <PerksStatusHelper />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          <ItemList>
            <ItemBreakfastPeopleCount />
          </ItemList>

          <ItemList>
            <ItemAppetizerPeopleCount />
          </ItemList>
        </div>
      </Card.Content>
    </Card>
  );
}

function PerksStatusHelper() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ExhibitorStatusIcon status={exhibitor.perksStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.perksStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.perksStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.perksStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

function ItemAppetizerPeopleCount() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-champagne-glasses-light" />}>
      <strong className="text-body-emphasis">
        {exhibitor.appetizerPeopleCount}
      </strong>{" "}
      personne
      {exhibitor.appetizerPeopleCount > 1 ? "s" : null} pour le verre de
      l’amitié
    </SimpleItem>
  );
}

function ItemBreakfastPeopleCount() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-croissant-light" />}>
      Petit-déjeuner :
      <br />
      <BreakfastPeopleCountDay
        day="samedi"
        peopleCount={exhibitor.breakfastPeopleCountSaturday}
      />
      <br />
      <BreakfastPeopleCountDay
        day="dimanche"
        peopleCount={exhibitor.breakfastPeopleCountSunday}
      />
    </SimpleItem>
  );
}

function BreakfastPeopleCountDay({
  peopleCount,
  day,
}: {
  peopleCount: number;
  day: string;
}) {
  return (
    <>
      <strong className="text-body-emphasis">{peopleCount}</strong> personne
      {peopleCount > 1 ? "s" : null} {day}
    </>
  );
}

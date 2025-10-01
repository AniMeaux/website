import { ItemList, SimpleItem } from "#core/data-display/item";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { ExhibitorStatusIcon } from "#show/exhibitors/status-icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardPerks() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Avantages</Card.Title>
      </Card.Header>

      <Card.Content>
        <PerksStatusHelper />

        <ItemList>
          <ItemBreakfastPeopleCount />
        </ItemList>
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

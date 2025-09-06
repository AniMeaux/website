import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Card } from "#core/layout/card.js";
import { Icon } from "#generated/icon.js";
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
          <ItemArea />
          <ItemMaxCount />
          <ItemMaxTableCount />
          <ItemMaxPeopleCount />
          <ItemMaxDividerCount />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemArea() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-expand-light" />}>
      Surface de{" "}
      <strong className="text-body-emphasis">{standSize.area} m²</strong>
    </SimpleItem>
  );
}

function ItemMaxCount() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-store-light" />}>
      <strong className="text-body-emphasis">
        {standSize.maxCount} stand{standSize.maxCount > 1 ? "s" : null}
      </strong>{" "}
      maximum
    </SimpleItem>
  );
}

function ItemMaxTableCount() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-table-picnic-light" />}>
      <strong className="text-body-emphasis">
        {standSize.maxTableCount} table
        {standSize.maxTableCount > 1 ? "s" : null}
      </strong>{" "}
      maximum
    </SimpleItem>
  );
}

function ItemMaxPeopleCount() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-people-group-light" />}>
      <strong className="text-body-emphasis">
        {standSize.maxPeopleCount} personne
        {standSize.maxPeopleCount > 1 ? "s" : null} sur stand
      </strong>{" "}
      maximum
    </SimpleItem>
  );
}

function ItemMaxDividerCount() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fence-light" />}>
      <strong className="text-body-emphasis">
        {standSize.maxDividerCount} cloison
        {standSize.maxDividerCount > 1 ? "s" : null}
      </strong>{" "}
      maximum
    </SimpleItem>
  );
}

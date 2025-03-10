import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { getLongLocation } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function ContactCard() {
  const { fosterFamily } = useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Contact</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon href="icon-phone-solid" />}>
            {fosterFamily.phone}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-envelope-solid" />}>
            {fosterFamily.email}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-location-dot-solid" />}>
            {getLongLocation(fosterFamily)}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

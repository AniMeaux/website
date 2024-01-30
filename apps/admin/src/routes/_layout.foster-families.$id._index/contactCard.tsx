import { Action } from "#core/actions";
import { BaseLink } from "#core/baseLink";
import { ItemList, SimpleItem } from "#core/dataDisplay/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { getLongLocation } from "#fosterFamilies/location";
import { Icon } from "#generated/icon";
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
          <SimpleItem icon={<Icon id="phone" />}>
            {fosterFamily.phone}
          </SimpleItem>

          <SimpleItem icon={<Icon id="envelope" />}>
            {fosterFamily.email}
          </SimpleItem>

          <SimpleItem icon={<Icon id="locationDot" />}>
            {getLongLocation(fosterFamily)}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

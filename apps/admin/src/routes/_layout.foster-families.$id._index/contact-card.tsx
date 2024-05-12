import { ItemList } from "#core/data-display/item-list";
import { Card } from "#core/layout/card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function ContactCard() {
  const { fosterFamily } = useLoaderData<loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Contact</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList.List>
          <ItemList.Item>
            <ItemList.Icon href="icon-phone" />
            <ItemList.Label>{fosterFamily.phone}</ItemList.Label>
          </ItemList.Item>

          <ItemList.Item>
            <ItemList.Icon href="icon-envelope" />
            <ItemList.Label>{fosterFamily.email}</ItemList.Label>
          </ItemList.Item>
        </ItemList.List>
      </Card.Content>
    </Card>
  );
}

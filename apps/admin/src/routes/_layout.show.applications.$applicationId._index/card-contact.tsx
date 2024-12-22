import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardContact() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Contact</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon href="icon-user" />}>
            {application.contactFirstname} {application.contactLastname}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-envelope" />}>
            {application.contactEmail}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-phone" />}>
            {application.contactPhone}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

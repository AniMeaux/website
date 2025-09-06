import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardContact() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Contact</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem isLightIcon icon={<Icon href="icon-user-light" />}>
            {application.contactFirstname} {application.contactLastname}
          </SimpleItem>

          <SimpleItem isLightIcon icon={<Icon href="icon-envelope-light" />}>
            {application.contactEmail}
          </SimpleItem>

          <SimpleItem isLightIcon icon={<Icon href="icon-phone-light" />}>
            {application.contactPhone}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

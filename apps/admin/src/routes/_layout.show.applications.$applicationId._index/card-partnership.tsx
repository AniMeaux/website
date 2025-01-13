import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import {
  EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION,
  PARTNERSHIP_CATEGORY_TRANSLATION,
} from "#show/applications/partnership-category";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardPartnership() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Partenariat</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon href="icon-paw-ribbon-solid" />}>
            {application.partnershipCategory != null
              ? PARTNERSHIP_CATEGORY_TRANSLATION[
                  application.partnershipCategory
                ]
              : application.otherPartnershipCategory != null
                ? EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION[
                    application.otherPartnershipCategory
                  ]
                : null}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import {
  ApplicationPartnershipCategory,
  ApplicationPartnershipCategoryIcon,
} from "#show/exhibitors/applications/partnership-category";

import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { loader } from "./loader.server";

export function CardPartnership() {
  const { application } = useLoaderData<typeof loader>();

  const category =
    application.partnershipCategory ?? application.otherPartnershipCategory;

  invariant(category != null, "A category should exist");

  return (
    <Card>
      <Card.Header>
        <Card.Title>Partenariat</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            isLightIcon
            icon={<ApplicationPartnershipCategoryIcon category={category} />}
          >
            {ApplicationPartnershipCategory.translation[category]}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

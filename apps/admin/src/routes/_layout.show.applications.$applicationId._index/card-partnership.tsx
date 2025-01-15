import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { TRANSLATION_BY_APPLICATION_PARTNERSHIP_CATEGORY } from "#show/partnership/category";
import { ApplicationPartnershipCategoryIcon } from "#show/partnership/icon";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { loader } from "./route";

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
            icon={<ApplicationPartnershipCategoryIcon category={category} />}
          >
            {TRANSLATION_BY_APPLICATION_PARTNERSHIP_CATEGORY[category]}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import {
  ApplicationSponsorshipCategory,
  ApplicationSponsorshipCategoryIcon,
} from "#show/exhibitors/applications/sponsorship-category";

import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { loader } from "./loader.server";

export function CardSponsorship() {
  const { application } = useLoaderData<typeof loader>();

  const category =
    application.sponsorshipCategory ?? application.otherSponsorshipCategory;

  invariant(category != null, "A category should exist");

  return (
    <Card>
      <Card.Header>
        <Card.Title>Sponsor</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            isLightIcon
            icon={<ApplicationSponsorshipCategoryIcon category={category} />}
          >
            {ApplicationSponsorshipCategory.translation[category]}
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

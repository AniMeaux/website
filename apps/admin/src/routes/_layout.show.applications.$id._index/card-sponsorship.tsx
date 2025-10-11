import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import {
  SponsorshipCategoryIcon,
  SponsorshipOptionalCategory,
} from "#show/sponsors/category";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardSponsorship() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Sponsor</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem
            isLightIcon
            icon={
              <SponsorshipCategoryIcon
                category={application.sponsorshipCategory}
              />
            }
          >
            {
              SponsorshipOptionalCategory.translation[
                application.sponsorshipCategory
              ]
            }
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

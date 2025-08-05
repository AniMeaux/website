import { ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { SponsorshipCategory } from "#show/sponsors/category";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardSituation() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemVisibility />
          <ItemCategory />
          <ItemExhibitor />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemCategory() {
  const { sponsor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-award-light" />}>
      Sponsor{" "}
      <strong className="text-body-emphasis">
        {SponsorshipCategory.translation[sponsor.category]}
      </strong>
    </SimpleItem>
  );
}

function ItemExhibitor() {
  const { sponsor } = useLoaderData<typeof loader>();

  if (sponsor.exhibitorId == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-store-light" />}>
      Est un{" "}
      <ProseInlineAction asChild>
        <BaseLink
          to={Routes.show.exhibitors.id(sponsor.exhibitorId).toString()}
        >
          Exposant
        </BaseLink>
      </ProseInlineAction>
    </SimpleItem>
  );
}

function ItemVisibility() {
  const { sponsor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      icon={
        <VisibilityIcon
          visibility={Visibility.fromBoolean(sponsor.isVisible)}
        />
      }
    >
      {sponsor.isVisible ? (
        <>
          <strong className="text-body-emphasis">Est visible</strong> sur le
          site
        </>
      ) : (
        <>
          <strong className="text-body-emphasis">N’est pas visible</strong> sur
          le site
        </>
      )}
    </SimpleItem>
  );
}

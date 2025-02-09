import { ProseInlineAction } from "#core/actions";
import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { ImageUrl } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardProfile() {
  const { partner } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Profil</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <DynamicImage
            imageId={ImageUrl.parse(partner.logoPath).id}
            alt={partner.name}
            sizeMapping={{ default: "160px", sm: "100vw", md: "33vw" }}
            fallbackSize="512"
            background="none"
            className="w-full rounded-2 border border-gray-200"
          />

          <ItemList>
            <ItemUrl />
          </ItemList>
        </div>
      </Card.Content>
    </Card>
  );
}

function ItemUrl() {
  const { partner } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-globe-light" />}>
      <ProseInlineAction variant="subtle" asChild>
        <a href={partner.url} target="_blank" rel="noreferrer">
          {partner.url}
        </a>
      </ProseInlineAction>
    </SimpleItem>
  );
}

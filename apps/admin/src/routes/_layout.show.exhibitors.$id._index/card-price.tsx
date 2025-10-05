import { Card } from "#core/layout/card";
import { ParticipationReceipt } from "#show/exhibitors/participation-receipt.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardPrice() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Prix de la prestation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ParticipationReceipt
          standSize={exhibitor.size}
          exhibitorCategory={exhibitor.category}
          hasCorner={exhibitor.hasCorner}
          tableCount={exhibitor.tableCount}
          hasTableCloths={exhibitor.hasTableCloths}
          breakfastPeopleCountSaturday={exhibitor.breakfastPeopleCountSaturday}
          breakfastPeopleCountSunday={exhibitor.breakfastPeopleCountSunday}
          peopleCount={exhibitor.peopleCount}
          dividerCount={exhibitor.dividerCount}
        />
      </Card.Content>
    </Card>
  );
}

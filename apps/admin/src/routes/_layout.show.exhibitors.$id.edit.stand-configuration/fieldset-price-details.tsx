import { OnOff } from "#core/form-elements/field-on-off.js";
import { Card } from "#core/layout/card.js";
import { ParticipationReceipt } from "#show/exhibitors/participation-receipt.js";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./loader.server.js";

export function FieldsetPriceDetails() {
  const { exhibitor, standSizes } = useLoaderData<typeof loader>();

  const { fields } = useForm();

  const selectedStandSize = standSizes.find(
    (standSize) => standSize.id === fields.sizeId.value,
  );

  const tableCount = Number(fields.tableCount.value);
  const hasTableCloths = OnOff.toBoolean(
    fields.hasTableCloths.value as OnOff.Enum,
  );

  const hasCorner = OnOff.toBoolean(fields.hasCorner.value as OnOff.Enum);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Prix estimé de la prestation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ParticipationReceipt
          standSize={selectedStandSize}
          exhibitorCategory={exhibitor.category}
          hasCorner={hasCorner}
          tableCount={tableCount}
          hasTableCloths={hasTableCloths}
          breakfastPeopleCountSaturday={exhibitor.breakfastPeopleCountSaturday}
          breakfastPeopleCountSunday={exhibitor.breakfastPeopleCountSunday}
        />
      </Card.Content>
    </Card>
  );
}

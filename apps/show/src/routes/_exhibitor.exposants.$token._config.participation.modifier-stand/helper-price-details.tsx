import { HelperCard } from "#i/core/layout/helper-card.js";
import { ParticipationReceipt } from "#i/exhibitors/participation-receipt.js";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./loader.server";

export function HelperPriceDetails() {
  const { exhibitor, standSizes } = useLoaderData<typeof loader>();

  const { fields } = useForm();

  const selectedStandSize = standSizes.find(
    (standSize) => standSize.id === fields.standSize.value,
  );

  const hasCorner = fields.hasCorner.value === "on";

  const tableCount = Number(fields.tableCount.value);
  const hasTableCloths = fields.hasTableCloths.value === "on";

  const peopleCount = Number(fields.peopleCount.value);

  const dividerCount =
    fields.dividerCount.value == null
      ? undefined
      : Number(fields.dividerCount.value);

  return (
    <HelperCard.Root color="alabaster">
      <HelperCard.Title>Prix estimé de la participation</HelperCard.Title>

      <ParticipationReceipt
        standSize={selectedStandSize}
        exhibitorCategory={exhibitor.category}
        hasCorner={hasCorner}
        tableCount={tableCount}
        hasTableCloths={hasTableCloths}
        breakfastPeopleCountSaturday={exhibitor.breakfastPeopleCountSaturday}
        breakfastPeopleCountSunday={exhibitor.breakfastPeopleCountSunday}
        peopleCount={peopleCount}
        dividerCount={dividerCount}
      />
    </HelperCard.Root>
  );
}

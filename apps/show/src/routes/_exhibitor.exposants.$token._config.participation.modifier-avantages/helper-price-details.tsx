import { HelperCard } from "#i/core/layout/helper-card.js";
import { ParticipationReceipt } from "#i/exhibitors/participation-receipt.js";
import { useLoaderData } from "@remix-run/react";
import { useForm } from "./form";
import type { loader } from "./loader.server";

export function HelperPriceDetails() {
  const { exhibitor } = useLoaderData<typeof loader>();

  const { fields } = useForm();

  const breakfastPeopleCountSaturday = Number(
    fields.breakfastPeopleCountSaturday.value,
  );

  const breakfastPeopleCountSunday = Number(
    fields.breakfastPeopleCountSunday.value,
  );

  return (
    <HelperCard.Root color="alabaster">
      <HelperCard.Title>Prix estimé de la participation</HelperCard.Title>

      <ParticipationReceipt
        standSize={exhibitor.size}
        exhibitorCategory={exhibitor.category}
        hasCorner={exhibitor.hasCorner}
        tableCount={exhibitor.tableCount}
        hasTableCloths={exhibitor.hasTableCloths}
        breakfastPeopleCountSaturday={breakfastPeopleCountSaturday}
        breakfastPeopleCountSunday={breakfastPeopleCountSunday}
        peopleCount={exhibitor.peopleCount}
      />
    </HelperCard.Root>
  );
}

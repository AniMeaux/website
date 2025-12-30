import { FormLayout } from "#i/core/layout/form-layout.js";
import { ParticipationReceipt } from "#i/exhibitors/participation-receipt.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server.js";
import { SectionId } from "./section-id.js";

export function SectionPrice() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id={SectionId.PRICE}>
      <FormLayout.Header>
        <FormLayout.Title>Prix de la participation</FormLayout.Title>
      </FormLayout.Header>

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
    </FormLayout.Section>
  );
}

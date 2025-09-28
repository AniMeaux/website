import { FormLayout } from "#core/layout/form-layout.js";
import { ParticipationReceipt } from "#exhibitors/participation-receipt.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server.js";

export function SectionPrice() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Header>
        <FormLayout.Title>Prix de la participation</FormLayout.Title>
      </FormLayout.Header>

      <ParticipationReceipt
        standSize={exhibitor.size}
        exhibitorCategory={exhibitor.category}
        hasCorner={exhibitor.hasCorner}
        tableCount={exhibitor.tableCount}
        hasTableCloths={exhibitor.hasTableCloths}
      />
    </FormLayout.Section>
  );
}

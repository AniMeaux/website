import { TaskItem } from "#i/core/data-display/task-item.js";
import { FormLayout } from "#i/core/layout/form-layout";
import { LightBoardCard } from "#i/core/layout/light-board-card";
import { Icon } from "#i/generated/icon.js";
import { InvoiceStatus } from "#i/invoice/status.js";
import type { SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function SectionInvoices() {
  const { invoices } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Factures</FormLayout.Title>

      {invoices.length === 0 ? (
        <LightBoardCard isSmall>
          <p>Aucune facture pour l’instant.</p>
        </LightBoardCard>
      ) : (
        invoices.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        ))
      )}
    </FormLayout.Section>
  );
}

function InvoiceItem({
  invoice,
}: {
  invoice: SerializeFrom<typeof loader>["invoices"][number];
}) {
  return (
    <TaskItem.Root to={invoice.url} target="_blank" rel="noreferrer">
      <TaskItem.Icon asChild>
        <Icon id="invoice-light" />
      </TaskItem.Icon>

      <TaskItem.Content>
        <TaskItem.Title>
          {invoice.amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </TaskItem.Title>

        <TaskItem.Description>
          {invoice.number}
          {" • "}
          {invoice.status === InvoiceStatus.Enum.TO_PAY ? (
            <>
              {InvoiceStatus.translation[invoice.status]} avant le{" "}
              {DateTime.fromISO(invoice.dueDate).toLocaleString(
                DateTime.DATE_MED,
              )}
            </>
          ) : (
            InvoiceStatus.translation[invoice.status]
          )}
        </TaskItem.Description>
      </TaskItem.Content>

      <TaskItem.ChevronIcon />
    </TaskItem.Root>
  );
}

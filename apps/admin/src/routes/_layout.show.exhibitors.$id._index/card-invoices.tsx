import { ProseInlineAction } from "#core/actions.js";
import { Empty } from "#core/data-display/empty.js";
import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Card } from "#core/layout/card";
import { Separator } from "#core/layout/separator.js";
import { Icon } from "#generated/icon.js";
import { InvoiceIcon } from "#show/invoice/icon.js";
import { InvoiceStatus } from "#show/invoice/status.js";
import { joinReactNodes } from "@animeaux/core";
import type { SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./loader.server";

export function CardInvoices() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Factures</Card.Title>
      </Card.Header>

      <Card.Content>
        {exhibitor.invoices.length > 0 ? (
          joinReactNodes(
            exhibitor.invoices.map((invoice) => (
              <ItemInvoice key={invoice.id} invoice={invoice} />
            )),
            <Separator />,
          )
        ) : (
          <Empty.Root>
            <Empty.Content>
              <Empty.Message>Aucune facture</Empty.Message>
            </Empty.Content>
          </Empty.Root>
        )}
      </Card.Content>
    </Card>
  );
}

type Invoice = SerializeFrom<typeof loader>["exhibitor"]["invoices"][number];

function ItemInvoice({ invoice }: { invoice: Invoice }) {
  return (
    <div className="grid grid-cols-fr-auto gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
        <ItemList>
          <ItemStatus status={invoice.status} dueDate={invoice.dueDate} />
          <ItemAmount amount={invoice.amount} />
        </ItemList>

        <ItemList>
          <ItemNumber number={invoice.number} />
          <ItemUrl url={invoice.url} />
        </ItemList>
      </div>

      <Icon href="icon-ellipsis-solid" />
    </div>
  );
}

function ItemNumber({ number }: { number: Invoice["number"] }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-hashtag-light" />}>
      {number}
    </SimpleItem>
  );
}

function ItemAmount({ amount }: { amount: Invoice["amount"] }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-tag-light" />}>
      {amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
    </SimpleItem>
  );
}

function ItemStatus({
  status,
  dueDate,
}: {
  status: Invoice["status"];
  dueDate: Invoice["dueDate"];
}) {
  return (
    <SimpleItem isLightIcon icon={<InvoiceIcon status={status} />}>
      {InvoiceStatus.translation[status]}
      {status === InvoiceStatus.Enum.TO_PAY ? (
        <>
          <br />
          Avant le {DateTime.fromISO(dueDate).toLocaleString(DateTime.DATE_MED)}
        </>
      ) : null}
    </SimpleItem>
  );
}

function ItemUrl({ url }: { url: Invoice["url"] }) {
  return (
    <SimpleItem
      isLightIcon
      icon={<Icon href="icon-arrow-up-right-from-square-light" />}
    >
      Voir{" "}
      <ProseInlineAction asChild>
        <a href={url} target="_blank" rel="noreferrer">
          facture
        </a>
      </ProseInlineAction>
    </SimpleItem>
  );
}

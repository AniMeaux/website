import { Action, ProseInlineAction } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { Empty } from "#core/data-display/empty.js";
import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { Card } from "#core/layout/card";
import { Separator } from "#core/layout/separator.js";
import { Routes } from "#core/navigation.js";
import { Dialog } from "#core/popovers/dialog.js";
import { Icon } from "#generated/icon.js";
import { theme } from "#generated/theme.js";
import { InvoiceIcon } from "#show/invoice/icon.js";
import { InvoiceStatus } from "#show/invoice/status.js";
import { joinReactNodes } from "@animeaux/core";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { SerializeFrom } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { ActionIntent } from "./action";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function CardBilling() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Facturation</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors.id(exhibitor.id).invoice.new.toString()}
          >
            Créer
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        {exhibitor.invoices.length > 0 ? (
          joinReactNodes(
            exhibitor.invoices.map((invoice) => (
              <InvoiceListItem
                key={invoice.id}
                invoice={invoice}
                exhibitorId={exhibitor.id}
              />
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

function InvoiceListItem({
  invoice,
  exhibitorId,
}: {
  invoice: Invoice;
  exhibitorId: string;
}) {
  const fetcher = useFetcher<typeof action>();

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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Action isIconOnly variant="text" color="gray">
            <Action.Icon href="icon-ellipsis-solid" />
          </Action>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            align="end"
            sideOffset={theme.spacing[1]}
            collisionPadding={theme.spacing[1]}
            className="z-20 grid w-[200px] grid-cols-1 gap-1 rounded-1 bg-white p-1 shadow-popover-sm animation-opacity-0 animation-duration-100 -animation-translate-y-2 data-[state=open]:animation-enter data-[state=closed]:animation-exit"
          >
            <DropdownMenu.Item asChild>
              <BaseLink
                to={Routes.show.exhibitors
                  .id(exhibitorId)
                  .invoice.id(invoice.id)
                  .edit.toString()}
                className="grid grid-cols-[auto,minmax(0px,1fr)] items-center rounded-0.5 pr-1 text-gray-500 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:focus-compact-blue-400 hover:bg-gray-100"
              >
                <span className="flex h-4 w-4 items-center justify-center text-[20px]">
                  <Icon href="icon-pen-solid" />
                </span>

                <span className="text-body-emphasis">Modifier</span>
              </BaseLink>
            </DropdownMenu.Item>

            <hr className="border-t border-gray-100" />

            <Dialog>
              <DropdownMenu.Item
                onSelect={(event) => event.preventDefault()}
                asChild
              >
                <Dialog.Trigger className="grid grid-cols-[auto,minmax(0px,1fr)] items-center rounded-0.5 pr-1 text-left text-red-500 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:focus-compact-blue-400 hover:bg-gray-100">
                  <span className="flex h-4 w-4 items-center justify-center text-[20px]">
                    <Icon href="icon-trash-solid" />
                  </span>

                  <span className="text-body-emphasis">Supprimer</span>
                </Dialog.Trigger>
              </DropdownMenu.Item>

              <Dialog.Content variant="alert">
                <Dialog.Header>Supprimer {invoice.number}</Dialog.Header>

                <Dialog.Message>
                  Êtes-vous sûr de vouloir supprimer{" "}
                  <strong className="text-body-emphasis">
                    {invoice.number}
                  </strong>
                  {" "}?
                  <br />
                  L’action est irréversible.
                </Dialog.Message>

                <Dialog.Actions>
                  <Dialog.CloseAction>Annuler</Dialog.CloseAction>

                  <fetcher.Form method="DELETE" className="flex">
                    <input
                      type="hidden"
                      name="intent"
                      value={ActionIntent.deleteInvoice}
                    />

                    <input type="hidden" name="invoiceId" value={invoice.id} />

                    <Dialog.ConfirmAction type="submit">
                      Oui, supprimer
                      <Action.Loader isLoading={fetcher.state !== "idle"} />
                    </Dialog.ConfirmAction>
                  </fetcher.Form>
                </Dialog.Actions>
              </Dialog.Content>
            </Dialog>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
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

import { getCompleteLocation, joinReactNodes } from "@animeaux/core"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import type { SerializeFrom } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { DateTime } from "luxon"

import { Action, ProseInlineAction } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { Empty } from "#i/core/data-display/empty.js"
import { ItemList, SimpleItem } from "#i/core/data-display/item.js"
import { Markdown, SENTENCE_COMPONENTS } from "#i/core/data-display/markdown.js"
import { Card } from "#i/core/layout/card.js"
import { Separator } from "#i/core/layout/separator.js"
import { Routes } from "#i/core/navigation.js"
import { Dialog } from "#i/core/popovers/dialog.js"
import { Icon } from "#i/generated/icon.js"
import { Spacing } from "#i/generated/theme.js"
import { InvoiceIcon } from "#i/show/invoice/icon.js"
import { InvoiceStatus } from "#i/show/invoice/status.js"

import { ActionIntent } from "./action.js"
import type { action } from "./action.server.js"
import type { loader } from "./loader.server.js"

export function CardBilling() {
  const { exhibitor } = useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>Facturation</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors.id(exhibitor.id).invoice.new.toString()}
          >
            Créer une facture
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemAddress />
        </ItemList>

        <Separator />

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
  )
}

function ItemAddress() {
  const { exhibitor } = useLoaderData<typeof loader>()

  return (
    <SimpleItem
      isLightIcon
      icon={<Icon href="icon-envelope-open-dollar-light" />}
    >
      <Markdown components={SENTENCE_COMPONENTS}>
        {getCompleteLocation({
          address: exhibitor.billingAddress,
          zipCode: exhibitor.billingZipCode,
          city: exhibitor.billingCity,
          country: exhibitor.billingCountry,
        })}
      </Markdown>
    </SimpleItem>
  )
}

type Invoice = SerializeFrom<typeof loader>["exhibitor"]["invoices"][number]

function InvoiceListItem({
  invoice,
  exhibitorId,
}: {
  invoice: Invoice
  exhibitorId: string
}) {
  const fetcher = useFetcher<typeof action>()

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
            sideOffset={Spacing.unitPx}
            collisionPadding={Spacing.unitPx}
            className="z-20 grid w-20 grid-cols-1 gap-1 rounded-1 bg-white p-1 shadow-popover-sm -out-translate-y-2 out-opacity-0 data-opened:animate-enter data-closed:animate-exit"
          >
            <DropdownMenu.Item asChild>
              <BaseLink
                to={Routes.show.exhibitors
                  .id(exhibitorId)
                  .invoice.id(invoice.id)
                  .edit.toString()}
                className="grid grid-cols-auto-fr items-center rounded-0.5 pr-1 text-gray-500 transition-colors ease-in-out hover:bg-gray-100 focus-visible:focus-ring active:bg-gray-100"
              >
                <span className="flex size-4 items-center justify-center icon-2">
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
                <Dialog.Trigger className="grid grid-cols-auto-fr items-center rounded-0.5 pr-1 text-left text-red-500 transition-colors ease-in-out hover:bg-gray-100 focus-visible:focus-ring active:bg-gray-100">
                  <span className="flex size-4 items-center justify-center icon-2">
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
  )
}

function ItemNumber({ number }: { number: Invoice["number"] }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-hashtag-light" />}>
      {number}
    </SimpleItem>
  )
}

function ItemAmount({ amount }: { amount: Invoice["amount"] }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-tag-light" />}>
      {amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
    </SimpleItem>
  )
}

function ItemStatus({
  status,
  dueDate,
}: {
  status: Invoice["status"]
  dueDate: Invoice["dueDate"]
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
  )
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
  )
}

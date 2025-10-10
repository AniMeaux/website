import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { ErrorsInlineHelper } from "#core/data-display/errors.js";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation.js";
import { getPageTitle } from "#core/page-title";
import { Dialog } from "#core/popovers/dialog.js";
import { Icon } from "#generated/icon.js";
import { theme } from "#generated/theme.js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { MetaFunction } from "@remix-run/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { action } from "./action.server.js";
import { CardApplicationList } from "./card-application-list";
import { CardDetails } from "./card-details";
import { CardExhibitorList } from "./card-exhibitor-list";
import { CardPrices } from "./card-prices";
import { CardSituation } from "./card-situation";
import type { loader } from "./loader.server";

export { action } from "./action.server";
export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getPageTitle(data?.standSize.label ?? getErrorTitle(404)) }];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  return (
    <>
      <Header />

      <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <div className="grid grid-cols-1 gap-1 md:col-start-2 md:row-start-1 md:gap-2">
          <CardSituation />
          <CardDetails />
          <CardPrices />
        </div>

        <div className="grid grid-cols-1 gap-1 md:gap-2">
          <CardExhibitorList />
          <CardApplicationList />
        </div>
      </PageLayout.Content>
    </>
  );
}

function Header() {
  const { standSize } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root className="grid grid-cols-2-auto justify-between gap-2 md:gap-4">
      <PageLayout.Header.Title>{standSize.label}</PageLayout.Header.Title>

      <div className="grid grid-cols-2-auto items-center gap-1">
        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.standSizes.id(standSize.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>

        <MoreMenu />
      </div>
    </PageLayout.Header.Root>
  );
}

function MoreMenu() {
  return (
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
          <MenuItemDelete />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuItemDelete() {
  const { applicationTotalCount, exhibitorTotalCount } =
    useLoaderData<typeof loader>();

  const canDeleted = applicationTotalCount === 0 && exhibitorTotalCount === 0;

  return (
    <Dialog>
      <DropdownMenu.Item onSelect={(event) => event.preventDefault()} asChild>
        <Dialog.Trigger className="grid grid-cols-[auto,minmax(0px,1fr)] items-center rounded-0.5 pr-1 text-left text-red-500 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:focus-compact-blue-400 hover:bg-gray-100">
          <span className="flex h-4 w-4 items-center justify-center text-[20px]">
            <Icon href="icon-trash-solid" />
          </span>

          <span className="text-body-emphasis">Supprimer</span>
        </Dialog.Trigger>
      </DropdownMenu.Item>

      {canDeleted ? <DialogContentDelete /> : <DialogContentCannotDelete />}
    </Dialog>
  );
}

function DialogContentDelete() {
  const { standSize } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <Dialog.Content variant="alert">
      <Dialog.Header>Supprimer {standSize.label}</Dialog.Header>

      <ErrorsInlineHelper errors={fetcher.data?.errors} />

      <Dialog.Message>
        Êtes-vous sûr de vouloir supprimer{" "}
        <strong className="text-body-emphasis">{standSize.label}</strong>
        {" "}?
        <br />
        L’action est irréversible.
      </Dialog.Message>

      <Dialog.Actions>
        <Dialog.CloseAction>Annuler</Dialog.CloseAction>

        <fetcher.Form method="DELETE" className="flex">
          <Dialog.ConfirmAction type="submit">
            Oui, supprimer
            <Action.Loader isLoading={fetcher.state !== "idle"} />
          </Dialog.ConfirmAction>
        </fetcher.Form>
      </Dialog.Actions>
    </Dialog.Content>
  );
}

function DialogContentCannotDelete() {
  const { standSize, applicationTotalCount, exhibitorTotalCount } =
    useLoaderData<typeof loader>();

  const details = [
    applicationTotalCount > 0
      ? `${applicationTotalCount} candidature${applicationTotalCount > 1 ? "s" : ""}`
      : null,
    exhibitorTotalCount > 0
      ? `${exhibitorTotalCount} exposant${exhibitorTotalCount > 1 ? "s" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" et ");

  return (
    <Dialog.Content variant="info">
      <Dialog.Header>Supprimer {standSize.label}</Dialog.Header>

      <Dialog.Message>
        La taille de stand ne peut être supprimée tant qu’elle est utilisée (
        {details}).
      </Dialog.Message>

      <Dialog.Actions>
        <Dialog.CloseAction>Fermer</Dialog.CloseAction>
      </Dialog.Actions>
    </Dialog.Content>
  );
}

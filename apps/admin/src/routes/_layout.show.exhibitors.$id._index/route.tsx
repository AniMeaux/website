import { Action } from "#i/core/actions.js";
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page";
import { InlineHelper } from "#i/core/data-display/helper.js";
import { PageLayout } from "#i/core/layout/page";
import { getPageTitle } from "#i/core/page-title";
import { Dialog } from "#i/core/popovers/dialog.js";
import { Icon } from "#i/generated/icon.js";
import { theme } from "#i/generated/theme.js";
import { SponsorshipCategory } from "#i/show/sponsors/category.js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { MetaFunction } from "@remix-run/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { ActionIntent } from "./action";
import type { action } from "./action.server";
import { CardBilling } from "./card-billing";
import { CardContact } from "./card-contact";
import { CardDescription } from "./card-description";
import { CardDocuments } from "./card-documents";
import { CardDogsConfiguration } from "./card-dogs-configuration";
import { CardOnStageAnimations } from "./card-on-stage-animations";
import { CardOnStandAnimations } from "./card-on-stand-animations";
import { CardPerks } from "./card-perks";
import { CardPrice } from "./card-price";
import { CardProfile } from "./card-profile";
import { CardSituation } from "./card-situation";
import { CardStandConfiguration } from "./card-stand-configuration";
import { CardStructure } from "./card-structure";
import type { loader } from "./loader.server";

export { action } from "./action.server";
export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getPageTitle(data?.exhibitor.name ?? getErrorTitle(404)) }];
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
          <CardContact />
          <CardProfile />
          <CardStructure />
        </div>

        <div className="grid grid-cols-1 gap-1 md:gap-2">
          <CardPrice />
          <CardBilling />
          <CardDescription />
          <CardStandConfiguration />
          <CardDogsConfiguration />
          <CardPerks />
          <CardDocuments />
          <CardOnStageAnimations />
          <CardOnStandAnimations />
        </div>
      </PageLayout.Content>
    </>
  );
}

function Header() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root className="grid grid-cols-2-auto justify-between gap-2 md:gap-4">
      <PageLayout.Header.Title>{exhibitor.name}</PageLayout.Header.Title>

      <MoreMenu />
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
          <DeleteMenuItem />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function DeleteMenuItem() {
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

      <DeleteDialogContent />
    </Dialog>
  );
}

function DeleteDialogContent() {
  const { exhibitor, sponsor } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <Dialog.Content variant="alert">
      <Dialog.Header>Supprimer {exhibitor.name}</Dialog.Header>

      {sponsor != null ? (
        <InlineHelper variant="info">
          {exhibitor.name} est actuellement sponsor{" "}
          {SponsorshipCategory.translation[sponsor.category]}.<br />
          La suppression de l’exposant entraînera aussi la suppression de son
          sponsoring.
        </InlineHelper>
      ) : null}

      {exhibitor.animations.length > 0 ? (
        <InlineHelper variant="warning">
          {exhibitor.name} a {exhibitor.animations.length}{" "}
          {exhibitor.animations.length > 1 ? "animations" : "animation"} sur
          scène.
          <br />
          La suppression de l’exposant n’affectera pas{" "}
          {exhibitor.animations.length > 1
            ? "ces animations"
            : "cette animation"}
          .
        </InlineHelper>
      ) : null}

      <Dialog.Message>
        Êtes-vous sûr de vouloir supprimer{" "}
        <strong className="text-body-emphasis">{exhibitor.name}</strong>
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
            value={ActionIntent.deleteExhibitor}
          />

          <Dialog.ConfirmAction type="submit">
            Oui, supprimer
            <Action.Loader isLoading={fetcher.state !== "idle"} />
          </Dialog.ConfirmAction>
        </fetcher.Form>
      </Dialog.Actions>
    </Dialog.Content>
  );
}

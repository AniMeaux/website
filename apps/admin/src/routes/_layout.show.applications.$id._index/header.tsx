import { Action } from "#core/actions.js";
import { InlineHelper } from "#core/data-display/helper.js";
import { PageLayout } from "#core/layout/page";
import { Dialog } from "#core/popovers/dialog.js";
import { Icon } from "#generated/icon.js";
import { theme } from "#generated/theme.js";
import { SponsorshipCategory } from "#show/sponsors/category.js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function Header() {
  const { application, canDelete } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root className="grid grid-cols-2-auto justify-between gap-2 md:gap-4">
      <PageLayout.Header.Title>
        {application.structureName}
      </PageLayout.Header.Title>

      {canDelete ? <MoreMenu /> : null}
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
  const { application } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <Dialog.Content variant="alert">
      <Dialog.Header>Supprimer {application.structureName}</Dialog.Header>

      <HelperIsExhibitor />

      <HelperIsSponsor />

      <HelperHasAnimations />

      <Dialog.Message>
        Êtes-vous sûr de vouloir supprimer{" "}
        <strong className="text-body-emphasis">
          {application.structureName}
        </strong>
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

function HelperIsExhibitor() {
  const { application } = useLoaderData<typeof loader>();

  if (application.exhibitor == null) {
    return null;
  }

  return (
    <InlineHelper variant="info">
      {application.structureName} est actuellement exposant.
      <br />
      La suppression de la candidature entraînera aussi la suppression de
      l’exposant.
    </InlineHelper>
  );
}

function HelperIsSponsor() {
  const { application } = useLoaderData<typeof loader>();

  if (application.exhibitor?.sponsorship == null) {
    return null;
  }

  return (
    <InlineHelper variant="info">
      {application.structureName} est actuellement sponsor{" "}
      {
        SponsorshipCategory.translation[
          application.exhibitor.sponsorship.category
        ]
      }
      .<br />
      La suppression de la candidature entraînera aussi la suppression de son
      sponsoring.
    </InlineHelper>
  );
}

function HelperHasAnimations() {
  const { application } = useLoaderData<typeof loader>();

  const animationCount = application.exhibitor?.animations.length ?? 0;

  if (animationCount === 0) {
    return null;
  }

  return (
    <InlineHelper variant="warning">
      {application.structureName} a {animationCount}{" "}
      {animationCount > 1 ? "animations" : "animation"} sur scène.
      <br />
      La suppression de la candidature n’affectera pas{" "}
      {animationCount > 1 ? "ces animations" : "cette animation"}.
    </InlineHelper>
  );
}

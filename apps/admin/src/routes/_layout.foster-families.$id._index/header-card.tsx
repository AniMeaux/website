import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ErrorsInlineHelper } from "#core/data-display/errors";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Dialog } from "#core/popovers/dialog";
import {
  AvailabilityIcon,
  getAvailabilityLabel,
} from "#foster-families/availability";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { action, loader } from "./route";

export function HeaderCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Content>
        <div className="grid grid-cols-fr-auto items-center gap-2">
          <div className="grid grid-cols-1 gap-1">
            <h1 className="text-title-section-large">
              {fosterFamily.displayName}
            </h1>

            <div className="flex items-start gap-0.5">
              <AvailabilityIcon
                availability={fosterFamily.availability}
                className="flex-none icon-20"
              />

              <p>
                {getAvailabilityLabel(
                  fosterFamily.availability,
                  fosterFamily.availabilityExpirationDate,
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2-auto gap-1">
            <div className="hidden md:flex">
              <Action variant="primary" asChild>
                <BaseLink
                  to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
                >
                  <Action.Icon href="icon-pen" />
                  Modifier
                </BaseLink>
              </Action>
            </div>

            <div className="flex md:hidden">
              <Action isIconOnly variant="primary" asChild>
                <BaseLink
                  to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
                  title="Modifier"
                >
                  <Action.Icon href="icon-pen" />
                </BaseLink>
              </Action>
            </div>

            <DeleteAction />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function DeleteAction() {
  const { fosterFamily, fosterAnimalCount } = useLoaderData<typeof loader>();
  const canDelete = fosterAnimalCount === 0;
  const fetcher = useFetcher<typeof action>();

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Action isIconOnly variant="secondary" color="red" title="Supprimer">
          <Action.Icon href="icon-trash" />
        </Action>
      </Dialog.Trigger>

      {canDelete ? (
        <Dialog.Content variant="alert">
          <Dialog.Header>Supprimer {fosterFamily.displayName}</Dialog.Header>

          <Dialog.Message>
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong className="text-body-emphasis">
              {fosterFamily.displayName}
            </strong>
            {" "}?
            <br />
            L’action est irréversible.
          </Dialog.Message>

          <ErrorsInlineHelper errors={fetcher.data?.errors} />

          <Dialog.Actions>
            <Dialog.CloseAction>Annuler</Dialog.CloseAction>

            <fetcher.Form method="DELETE" className="flex">
              <Dialog.ConfirmAction type="submit">
                Oui, supprimer
              </Dialog.ConfirmAction>
            </fetcher.Form>
          </Dialog.Actions>
        </Dialog.Content>
      ) : (
        <Dialog.Content variant="warning">
          <Dialog.Header>Suppression impossible</Dialog.Header>

          <Dialog.Message>
            La famille d’accueil ne peut être supprimée tant qu’elle a des
            animaux accueillis.
          </Dialog.Message>

          <Dialog.Actions>
            <Dialog.CloseAction>Fermer</Dialog.CloseAction>
          </Dialog.Actions>
        </Dialog.Content>
      )}
    </Dialog>
  );
}

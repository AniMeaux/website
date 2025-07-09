import { Action } from "#core/actions";
import { ErrorsInlineHelper } from "#core/data-display/errors";
import { InlineHelper } from "#core/data-display/helper";
import { Card } from "#core/layout/card";
import { Dialog } from "#core/popovers/dialog";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function CardActions() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Actions</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-1">
          <ActionBan />
          <ActionDelete />
        </div>
      </Card.Content>
    </Card>
  );
}

export const BanActionFormData = FormDataDelegate.create(
  zu.object({
    isBanned: zu.checkbox(),
  }),
);

function ActionBan() {
  const { fosterFamily } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  const done = fetcher.state === "idle" && fetcher.data != null;
  useEffect(() => {
    if (done) {
      setIsDialogOpened(false);
    }
  }, [done]);

  return (
    <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
      <Dialog.Trigger asChild>
        <Action variant="secondary" color="orange">
          <Action.Icon href="icon-ban-solid" />
          {fosterFamily.isBanned ? "Débannir" : "Bannir"}
        </Action>
      </Dialog.Trigger>

      <Dialog.Content variant="warning">
        <Dialog.Header>
          {fosterFamily.isBanned ? "Débannir" : "Bannir"}{" "}
          {fosterFamily.displayName}
        </Dialog.Header>

        <Dialog.Message>
          Êtes-vous sûr de vouloir{" "}
          {fosterFamily.isBanned ? "débannir" : "bannir"}{" "}
          <strong className="text-body-emphasis">
            {fosterFamily.displayName}
          </strong>
          {" "}?
        </Dialog.Message>

        <ErrorsInlineHelper errors={fetcher.data?.errors} />

        <Dialog.Actions>
          <Dialog.CloseAction>Annuler</Dialog.CloseAction>

          <fetcher.Form method="POST" className="flex">
            {!fosterFamily.isBanned ? (
              <input
                type="hidden"
                name={BanActionFormData.keys.isBanned}
                value="on"
              />
            ) : null}

            <Dialog.ConfirmAction type="submit">
              Oui, {fosterFamily.isBanned ? "débannir" : "bannir"}
            </Dialog.ConfirmAction>
          </fetcher.Form>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  );
}

function ActionDelete() {
  const { fosterFamily, fosterAnimalCount } = useLoaderData<typeof loader>();
  const canDelete = fosterAnimalCount === 0;
  const fetcher = useFetcher<typeof action>();
  const [isHelperVisible, setIsHelperVisible] = useState(false);

  return (
    <>
      {isHelperVisible ? (
        <InlineHelper
          variant="info"
          action={
            <button onClick={() => setIsHelperVisible(false)}>Fermer</button>
          }
        >
          La famille d’accueil ne peut être supprimée tant qu’elle a des animaux
          accueillis.
        </InlineHelper>
      ) : null}

      <Dialog>
        <Dialog.Trigger
          asChild
          onClick={
            canDelete
              ? undefined
              : (event) => {
                  // Don't open de dialog.
                  event.preventDefault();

                  setIsHelperVisible(true);
                }
          }
        >
          <Action variant="secondary" color="red">
            <Action.Icon href="icon-trash-solid" />
            Supprimer
          </Action>
        </Dialog.Trigger>

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
      </Dialog>
    </>
  );
}

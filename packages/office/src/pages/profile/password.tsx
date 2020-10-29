import { ErrorCode, getErrorMessage, hasErrorCode } from "@animeaux/shared";
import { useRouter } from "next/router";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import { FaLock } from "react-icons/fa";
import { useCurrentUser } from "../../core/user/currentUserContext";
import { Button } from "../../ui/button";
import { Adornment } from "../../ui/formElements/adornment";
import { Field } from "../../ui/formElements/field";
import { Form } from "../../ui/formElements/form";
import { Label } from "../../ui/formElements/label";
import { PasswordInput } from "../../ui/formElements/passwordInput";
import {
  Header,
  HeaderBackLink,
  HeaderPlaceholder,
  HeaderTitle,
} from "../../ui/layouts/header";
import { Main } from "../../ui/layouts/main";
import { PageLayout } from "../../ui/layouts/pageLayout";
import { ProgressBar } from "../../ui/loaders/progressBar";
import { Message } from "../../ui/message";

export default function PasswordPage() {
  const router = useRouter();
  const back = (router.query.back as string) ?? "/";

  const { updatePassword } = useCurrentUser();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [
    updatePasswordCallback,
    { pending, value: hasSucceeded, error },
  ] = useAsyncCallback(async () => {
    await updatePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    return true;
  }, [currentPassword, newPassword, updatePassword]);

  let currentPasswordError: string | null = null;
  let newPasswordError: string | null = null;
  let globalError: string | null = null;

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (hasErrorCode(error, ErrorCode.AUTH_WRONG_PASSWORD)) {
      currentPasswordError = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.AUTH_WEEK_PASSWORD)) {
      newPasswordError = errorMessage;
    } else {
      globalError = errorMessage;
    }
  }

  return (
    <PageLayout
      header={
        <Header>
          <HeaderBackLink href={`..?back=${encodeURIComponent(back)}`} />
          <HeaderTitle>Mot de passe</HeaderTitle>
          <HeaderPlaceholder />
        </Header>
      }
    >
      {pending && <ProgressBar />}

      <Main className="px-4">
        {globalError != null && (
          <Message type="error" className="mb-2">
            {globalError}
          </Message>
        )}

        {error == null && hasSucceeded && (
          <Message type="success" className="mb-2">
            Votre mot de passe à bien été mis à jour.
          </Message>
        )}

        <Form onSubmit={updatePasswordCallback} pending={pending}>
          <Field>
            <Label htmlFor="password">Mot de passe actuel</Label>
            <PasswordInput
              name="password"
              id="password"
              autoComplete="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              errorMessage={currentPasswordError}
              leftAdornment={
                <Adornment>
                  <FaLock />
                </Adornment>
              }
            />
          </Field>

          <Field>
            <Label htmlFor="new-password">Nouveau mot de passe</Label>
            <PasswordInput
              name="new-password"
              id="new-password"
              autoComplete="new-password"
              value={newPassword}
              onChange={setNewPassword}
              errorMessage={newPasswordError}
              leftAdornment={
                <Adornment>
                  <FaLock />
                </Adornment>
              }
            />
          </Field>

          <Field>
            <Button
              type="submit"
              variant="primary"
              color="blue"
              disabled={pending}
            >
              Modifier
            </Button>
          </Field>
        </Form>
      </Main>
    </PageLayout>
  );
}

import { hasErrorCode } from "@animeaux/shared";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import { FaLock } from "react-icons/fa";
import { useCurrentUser } from "../../core/user";
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
import { ProgressBar } from "../../ui/loaders/progressBar";
import { Message } from "../../ui/message";

export default function PasswordPage() {
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
    if (hasErrorCode(error, "auth/wrong-password")) {
      currentPasswordError = "Le mot de passe est invalide";
    } else if (hasErrorCode(error, "auth/weak-password")) {
      newPasswordError = "Le mot de passe doit avoir au moins 6 caractères";
    } else {
      globalError = error.message;
    }
  }

  return (
    <>
      <Header>
        <HeaderBackLink href="/profile" />
        <HeaderTitle>Mot de passe</HeaderTitle>
        <HeaderPlaceholder />
      </Header>

      {pending && <ProgressBar />}

      <Main>
        <Form
          className="px-4"
          onSubmit={updatePasswordCallback}
          pending={pending}
        >
          {globalError != null && (
            <Field>
              <Message type="error">{globalError}</Message>
            </Field>
          )}

          {error == null && hasSucceeded && (
            <Field>
              <Message type="success">
                Votre mot de passe à bien été mis à jour.
              </Message>
            </Field>
          )}

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
    </>
  );
}

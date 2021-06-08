import { ErrorCode, getErrorCode } from "@animeaux/shared-entities";
import { firebase } from "core/firebase";
import { PageTitle } from "core/pageTitle";
import { useMutation } from "core/request";
import { Sentry } from "core/sentry";
import { Adornment } from "formElements/adornment";
import { Field } from "formElements/field";
import { Form } from "formElements/form";
import { Input } from "formElements/input";
import { Label } from "formElements/label";
import { PasswordInput } from "formElements/passwordInput";
import { SubmitButton } from "formElements/submitButton";
import { AppIcon } from "icons/appIcon";
import { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaLock } from "react-icons/fa";

function isAuthError(error: Error): boolean {
  return [
    ErrorCode.AUTH_INVALID_EMAIL,
    ErrorCode.AUTH_USER_DISABLED,
    ErrorCode.AUTH_USER_NOT_FOUND,
    ErrorCode.AUTH_WRONG_PASSWORD,
  ].includes(getErrorCode(error));
}

export function SignInPage() {
  const mutation = useMutation<
    void,
    Error,
    { email: string; password: string }
  >(
    async ({ email, password }) => {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        if (isAuthError(error)) {
          throw new Error("Identifiants invalides, veuillez réessayer");
        } else {
          Sentry.captureException(error, { extra: { email } });

          throw new Error(
            "un problème est survenu, veuillez réessayer ultérieurement"
          );
        }
      }
    },
    {
      // Relevant errors are reported here.
      disableSentry: true,
    }
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <PageTitle title="Connection" />

      <main className="SignInPage__main">
        <div className="SignInPage__image" />

        <Form
          onSubmit={() => mutation.mutate({ email, password })}
          pending={mutation.isLoading}
          className="SignInPage__form"
        >
          <AppIcon className="SignInPage__logo" />

          <h1 className="SignInPage__title">Bienvenue</h1>

          <Field>
            <Label htmlFor="email" hasError={mutation.isError}>
              Email
            </Label>

            <Input
              name="email"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              placeholder="ex: jean@mail.fr"
              hasError={mutation.isError}
              leftAdornment={
                <Adornment>
                  <FaEnvelope />
                </Adornment>
              }
            />
          </Field>

          <Field>
            <Label htmlFor="password" hasError={mutation.isError}>
              Mot de passe
            </Label>

            <PasswordInput
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              hasError={mutation.isError}
              leftAdornment={
                <Adornment>
                  <FaLock />
                </Adornment>
              }
            />
          </Field>

          {mutation.isSuccess ? (
            <FaCheckCircle className="SignInPage__successIcon" />
          ) : (
            <SubmitButton loading={mutation.isLoading}>
              Se connecter
            </SubmitButton>
          )}
        </Form>
      </main>
    </>
  );
}

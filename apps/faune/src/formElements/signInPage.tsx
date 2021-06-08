import { PageTitle } from "core/pageTitle";
import { UseMutationResult } from "core/request";
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

type CredentialsPayload = {
  email: string;
  password: string;
};

export type SignInPageProps = {
  mutation: UseMutationResult<void, Error, CredentialsPayload, unknown>;
};

export function SignInPage({ mutation }: SignInPageProps) {
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

import { ErrorCode, getErrorCode } from "@animeaux/shared-entities";
import {
  Adornment,
  Field,
  Form,
  Input,
  Label,
  PasswordInput,
  SubmitButton,
} from "@animeaux/ui-library";
import firebase from "firebase/app";
import * as React from "react";
import { FaCheckCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { useMutation } from "../request";

function isAuthError(error: Error): boolean {
  return [
    ErrorCode.AUTH_INVALID_EMAIL,
    ErrorCode.AUTH_USER_DISABLED,
    ErrorCode.AUTH_USER_NOT_FOUND,
    ErrorCode.AUTH_WRONG_PASSWORD,
  ].includes(getErrorCode(error));
}

export type SignInPageProps = {
  logo: React.ElementType;
  applicationName: string;
};

export function SignInPage({ logo: Logo, applicationName }: SignInPageProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const mutation = useMutation<
    void,
    Error,
    { email: string; password: string }
  >(async ({ email, password }) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (isAuthError(error)) {
        throw new Error("Identifiants invalides, veuillez réessayer");
      } else {
        throw new Error(
          "un problème est survenu, veuillez réessayer ultérieurement"
        );
      }
    }
  });

  return (
    <main className="pt-screen-3/10 flex flex-col justify-center">
      <div className="relative mx-auto w-full max-w-md flex flex-col">
        <div className="absolute bottom-1/1 left-1/2 transform -translate-x-1/2 mb-8 flex flex-col items-center">
          <Logo className="text-8xl" />
          <span className="font-serif tracking-wider">{applicationName}</span>
        </div>

        <h1 className="px-6 text-3xl font-serif text-center">Bienvenue</h1>

        <Form
          onSubmit={() => mutation.mutate({ email, password })}
          pending={mutation.isLoading}
        >
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
              autoComplete="password"
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
            <FaCheckCircle className="mx-auto mt-4 w-10 h-10 text-green-500" />
          ) : (
            <SubmitButton disabled={mutation.isLoading}>
              Se connecter
            </SubmitButton>
          )}
        </Form>
      </div>
    </main>
  );
}

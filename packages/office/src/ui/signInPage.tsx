import { ErrorCode, getErrorCode } from "@animeaux/shared";
import firebase from "firebase/app";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Logo from "../ui/logoWithColors.svg";
import { Button } from "./button";
import { Adornment } from "./formElements/adornment";
import { Field } from "./formElements/field";
import { Form } from "./formElements/form";
import { Input } from "./formElements/input";
import { Label } from "./formElements/label";
import { PasswordInput } from "./formElements/passwordInput";
import { PageTitle } from "./layouts/page";
import { ProgressBar } from "./loaders/progressBar";
import { Message } from "./message";

function isAuthError(error: Error): boolean {
  return [
    ErrorCode.AUTH_INVALID_EMAIL,
    ErrorCode.AUTH_USER_DISABLED,
    ErrorCode.AUTH_USER_NOT_FOUND,
    ErrorCode.AUTH_WRONG_PASSWORD,
  ].includes(getErrorCode(error));
}

export function SignInPage() {
  const [email, setEmail] = React.useState("simon@animeaux.org");
  const [password, setPassword] = React.useState(`password`);

  const [signIn, signInState] = useAsyncCallback<boolean>(async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      if (isAuthError(error)) {
        throw new Error("Identifiants invalides, veuillez réessayer");
      } else {
        throw new Error(
          "un problème est survenu, veuillez réessayer ultérieurement"
        );
      }
    }
  }, [email, password]);

  // We also want to display the loader when the sign in succeed to wait until
  // the page "redirect".
  const pending = signInState.value || signInState.pending;

  return (
    <main className="w-screen h-screen flex flex-col justify-center">
      <PageTitle title="Connexion" />

      {pending && <ProgressBar />}

      <div className="relative mx-auto w-full max-w-md px-4 flex flex-col">
        <Logo className="absolute bottom-1/1 left-1/2 transform -translate-x-1/2 mb-8 text-8xl" />

        <h1 className="text-3xl font-serif">Bienvenue</h1>

        {signInState.error != null && (
          <Message type="error" className="my-2">
            {signInState.error.message}
          </Message>
        )}

        <Form onSubmit={signIn} pending={pending}>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              placeholder="jean@mail.fr"
              leftAdornment={
                <Adornment>
                  <FaEnvelope />
                </Adornment>
              }
            />
          </Field>

          <Field>
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              name="password"
              id="password"
              autoComplete="password"
              value={password}
              onChange={setPassword}
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
              Se connecter
            </Button>
          </Field>
        </Form>
      </div>
    </main>
  );
}

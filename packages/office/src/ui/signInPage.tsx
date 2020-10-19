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
import { PageHead } from "./layouts/pageHead";
import { PageTitle } from "./layouts/pageTitle";
import { ProgressBar } from "./loaders/progressBar";
import { Message } from "./message";

export function SignInPage() {
  const [email, setEmail] = React.useState("simon@animeaux.org");
  const [password, setPassword] = React.useState(`sS'R7("f)ZYC#X-Jv,`);

  const [signIn, signInState] = useAsyncCallback<boolean>(async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      // Authentication errors have a code that start with "auth/".
      // See https://firebase.google.com/docs/reference/js/firebase.auth.Auth#error-codes_12
      if (
        typeof error.code === "string" &&
        (error.code as string).startsWith("auth/")
      ) {
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
      <PageHead />
      <PageTitle />

      {pending && <ProgressBar />}

      <div className="relative px-4 flex flex-col">
        <Logo className="absolute bottom-1/1 left-1/2 transform -translate-x-1/2 mb-8 text-8xl" />

        <h1 className="text-3xl font-serif">Bienvenue</h1>

        <Form onSubmit={signIn} pending={pending}>
          {signInState.error != null && (
            <Field>
              <Message type="error">{signInState.error.message}</Message>
            </Field>
          )}

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

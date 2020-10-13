import firebase from "firebase/app";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import Logo from "../ui/logo.svg";
import { Button } from "./button";
import { ErrorMessage } from "./errorMessage";
import { Field } from "./formElements/field";
import { Form } from "./formElements/form";
import { Input } from "./formElements/input";
import { Label } from "./formElements/label";
import { PageHead } from "./layouts/pageHead";
import { PageTitle } from "./layouts/pageTitle";

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
        throw new Error("Identifiants invalides, veuillez réessayer.");
      } else {
        throw new Error(
          "un problème est survenu, veuillez réessayer ultérieurement."
        );
      }
    }
  }, [email, password]);

  return (
    <main>
      <PageHead />
      <PageTitle />

      <div className="mx-auto mt-8 w-10/12 max-w-sm bg-white rounded-lg flat-shadow">
        <header className="text-8xl pt-16 pb-8 flex justify-center">
          <Logo />
        </header>

        <Form
          onSubmit={signIn}
          // We also want to display the loader when the sign in succeed to
          // wait until the page "redirect".
          pending={signInState.value || signInState.pending}
        >
          {signInState.error != null && (
            <ErrorMessage>{signInState.error.message}</ErrorMessage>
          )}

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              disabled={signInState.pending}
              hasError={signInState.error != null}
            />
          </Field>

          <Field>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              name="password"
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              disabled={signInState.pending}
              hasError={signInState.error != null}
            />
          </Field>

          <Field>
            <Button type="submit" disabled={signInState.pending}>
              Se connecter
            </Button>
          </Field>
        </Form>
      </div>
    </main>
  );
}

import { ErrorCode, getErrorCode } from "@animeaux/shared-entities";
import {
  Adornment,
  Button,
  Field,
  Form,
  Input,
  Label,
  Message,
  PasswordInput,
  ProgressBar,
} from "@animeaux/ui-library";
import firebase from "firebase/app";
import * as React from "react";
import { useAsyncCallback } from "react-behave";
import { FaEnvelope, FaLock } from "react-icons/fa";

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
};

export function SignInPage({ logo: Logo }: SignInPageProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

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
    <main className="pt-screen-3/10 md:pt-0 md:w-screen md:h-screen flex flex-col justify-center">
      {pending && <ProgressBar />}

      <div className="relative mx-auto w-full max-w-md px-4 flex flex-col">
        <div className="absolute bottom-1/1 left-1/2 transform -translate-x-1/2 mb-8 flex flex-col items-center">
          <Logo className="text-8xl" />
          <span className="font-serif tracking-wider">
            {process.env.NEXT_PUBLIC_APP_SHORT_NAME}
          </span>
        </div>

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
              placeholder="ex: jean@mail.fr"
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

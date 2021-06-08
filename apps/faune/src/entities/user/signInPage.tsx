import { ErrorCode, getErrorCode } from "@animeaux/shared-entities";
import { firebase } from "core/firebase";
import { useMutation } from "core/request";
import { Sentry } from "core/sentry";
import { SignInPage as SignInPageUI } from "formElements/signInPage";
import * as React from "react";

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

  return <SignInPageUI mutation={mutation} />;
}

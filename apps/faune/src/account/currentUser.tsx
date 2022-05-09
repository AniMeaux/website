import { CurrentUser, hasGroups, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { SignInPage } from "~/account/signInPage";
import { Link } from "~/core/actions/link";
import { firebase } from "~/core/firebase";
import { ErrorPage } from "~/core/layouts/errorPage";
import { useOperationQuery } from "~/core/operations";
import { Sentry } from "~/core/sentry";
import { ChildrenProp } from "~/core/types";

type CurrentUserContextValue = {
  currentUser: CurrentUser | null;
  signOut(): Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

type CurrentUserContextProviderProps = ChildrenProp & {
  authorisedGroupsForPage?: UserGroup[];
};

export function CurrentUserContextProvider({
  authorisedGroupsForPage,
  children,
}: CurrentUserContextProviderProps) {
  const getCurrentUser = useOperationQuery(
    { name: "getCurrentUser" },
    {
      onSuccess: (response) => {
        Sentry.setUser(response.result);
      },
      onError: () => {
        Sentry.setUser(null);
      },
    }
  );

  // Wrap it in a Ref to avoid adding it to the dependencies of the effect
  // bellow.
  const getCurrentUserRef = useRef(getCurrentUser);
  useEffect(() => {
    getCurrentUserRef.current = getCurrentUser;
  });

  const currentUser =
    getCurrentUser.state === "success" ? getCurrentUser.result : null;

  useEffect(() => {
    // Firebase updates the id token every hour, this makes sure the react
    // state and the cookie are both kept up to date.
    return firebase.auth().onIdTokenChanged(async (firebaseUser) => {
      await updateToken(firebaseUser);
      getCurrentUserRef.current.reRun();
    });
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({ currentUser, signOut }),
    [currentUser]
  );

  if (getCurrentUser.state === "loading") {
    // Stale the app until we know whether a user is signed in or not.
    // TODO: Render a nice loader
    return null;
  }

  if (getCurrentUser.state === "error") {
    return <ErrorPage status={getCurrentUser.status} />;
  }

  if (currentUser == null) {
    return <SignInPage />;
  }

  if (
    authorisedGroupsForPage != null &&
    !hasGroups(currentUser, authorisedGroupsForPage)
  ) {
    return (
      <ErrorPage
        status={403}
        message="Vous n'êtes pas authorisé à accéder à cette page. Si vous pensez que c'est une erreur merci de contacter un administrateur."
        action={
          <Link href="/" variant="primary">
            Retour
          </Link>
        }
      />
    );
  }

  return <CurrentUserContext.Provider value={value} children={children} />;
}

async function signOut() {
  await firebase.auth().signOut();
}

async function updateToken(firebaseUser: firebase.User | null) {
  if (firebaseUser == null) {
    localStorage.removeItem("token");
    return;
  }

  const token = await firebaseUser.getIdToken();
  localStorage.setItem("token", token);
}

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  invariant(
    context != null,
    "useCurrentUser should not be used outside of a CurrentUserContextProvider."
  );

  const { currentUser, ...rest } = context;
  invariant(
    currentUser != null,
    "useCurrentUser should not be used when there is no user."
  );

  return { currentUser, ...rest };
}

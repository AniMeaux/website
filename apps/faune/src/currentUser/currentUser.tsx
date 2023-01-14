import { CurrentUser, hasGroups, UserGroup } from "@animeaux/shared";
import invariant from "invariant";
import { createContext, useContext, useEffect, useMemo } from "react";
import { Link } from "~/core/actions/link";
import { ErrorPage } from "~/core/layouts/errorPage";
import { useOperationQuery } from "~/core/operations";
import { setUser } from "~/core/sentry";
import { ChildrenProp } from "~/core/types";
import { SignInPage } from "~/currentUser/signInPage";

type CurrentUserContextValue = {
  currentUser: CurrentUser | null;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

type CurrentUserContextProviderProps = ChildrenProp & {
  authorisedGroupsForPage?: UserGroup[];
};

export function CurrentUserContextProvider({
  authorisedGroupsForPage,
  children,
}: CurrentUserContextProviderProps) {
  // TODO: To remove after password migration is done.
  useEffect(() => {
    // Remove legacy token.
    localStorage.removeItem("token");
  }, []);

  const getCurrentUser = useOperationQuery(
    { name: "getCurrentUser" },
    {
      onSuccess: (response) => {
        setUser(response.result);
      },
      onError: () => {
        setUser(null);
      },
    }
  );

  const currentUser =
    getCurrentUser.state === "success" ? getCurrentUser.result : null;

  const value = useMemo<CurrentUserContextValue>(
    () => ({ currentUser }),
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

  if (!hasGroups(currentUser, [UserGroup.ADMIN])) {
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

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  invariant(
    context != null,
    "useCurrentUser should not be used outside of a CurrentUserContextProvider."
  );

  const { currentUser } = context;
  invariant(
    currentUser != null,
    "useCurrentUser should not be used when there is no user."
  );

  return { currentUser };
}

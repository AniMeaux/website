import {
  doesGroupsIntersect,
  ErrorCode,
  User,
  UserGroup,
} from "@animeaux/shared-entities";
import { ButtonLink, ChildrenProp, Main } from "@animeaux/ui-library";
import * as Sentry from "@sentry/react";
import { gql } from "graphql-request";
import invariant from "invariant";
import * as React from "react";
import { ErrorPage, ErrorPageType } from "../errorPage";
import { firebase } from "../firebase";
import { PageTitle } from "../page";
import { fetchGraphQL } from "../request";
import { SignInPage } from "./signInPage";
import { UserFragment } from "./userQueries";

type CurrentUserContextValue = {
  currentUser: User | null;
  signOut(): Promise<void>;
  updateProfile(displayName: string): Promise<void>;
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
};

const CurrentUserContext = React.createContext<CurrentUserContextValue | null>(
  null
);

async function updateProfile(displayName: string) {
  displayName = displayName.trim();

  if (displayName === "") {
    throw new Error(ErrorCode.USER_MISSING_DISPLAY_NAME);
  }

  const currentUser = firebase.auth().currentUser;
  invariant(
    currentUser != null,
    "Cannot call updateProfile when there is no user."
  );

  await currentUser.updateProfile({ displayName });
  await currentUser.reload();
}

async function updatePassword(currentPassword: string, newPassword: string) {
  const currentUser = firebase.auth().currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(
    currentUser!.email!,
    currentPassword
  );

  invariant(
    currentUser != null,
    "Cannot call updatePassword when there is no user."
  );

  await currentUser.reauthenticateWithCredential(credential);
  await currentUser.updatePassword(newPassword);
  await currentUser.reload();
}

async function signOut() {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    Sentry.captureException(error, {
      extra: { operation: "Could not sign out" },
    });

    console.error("Could not sign out", error);
  }
}

async function updateToken(firebaseUser: firebase.User | null) {
  if (firebaseUser == null) {
    localStorage.removeItem("token");
  } else {
    try {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem("token", token);
    } catch (error) {
      Sentry.captureException(error, {
        extra: { operation: "Could not set token in storage" },
      });

      console.error("Could not set token in storage", error);
    }
  }
}

const CurrentUserQuery = gql`
  query CurrentUserQuery {
    user: getCurrentUser {
      ...UserFragment
    }
  }

  ${UserFragment}
`;

async function getCurrentUser(): Promise<User | null> {
  try {
    const { user } = await fetchGraphQL<{ user: User | null }>(
      CurrentUserQuery
    );

    return user;
  } catch (error) {
    Sentry.captureException(error, {
      extra: { operation: "Could not get current user" },
    });

    console.error("Could not get current user", error);
    return null;
  }
}

type UserState = {
  hasResult: boolean;
  currentUser: User | null;
};

export type CurrentUserContextProviderProps = ChildrenProp & {
  authorisedGroupsForApplication: UserGroup[];
  authorisedGroupsForPage?: UserGroup[];
  logo: React.ElementType;
  applicationName: string;
};

export function CurrentUserContextProvider({
  authorisedGroupsForApplication,
  authorisedGroupsForPage,
  logo: Logo,
  applicationName,
  children,
}: CurrentUserContextProviderProps) {
  const [{ hasResult, currentUser }, setState] = React.useState<UserState>({
    hasResult: false,
    currentUser: null,
  });

  React.useEffect(() => {
    // Firebase updates the id token every hour, this makes sure the react
    // state and the cookie are both kept up to date.
    return firebase.auth().onIdTokenChanged(async (firebaseUser) => {
      await updateToken(firebaseUser);

      let user: User | null = null;
      if (firebaseUser != null) {
        user = await getCurrentUser();
      }

      Sentry.setUser(user);
      setState({ hasResult: true, currentUser: user });
    });
  }, []);

  const updateProfileCallback = React.useCallback<
    CurrentUserContextValue["updateProfile"]
  >(async (profile) => {
    await updateProfile(profile);

    // Keep the provided user object up to date.
    const user = await getCurrentUser();
    setState({ hasResult: true, currentUser: user });
  }, []);

  const value = React.useMemo<CurrentUserContextValue>(
    () => ({
      currentUser,
      signOut,
      updateProfile: updateProfileCallback,
      updatePassword,
    }),
    [currentUser, updateProfileCallback]
  );

  if (!hasResult) {
    // Stale the app until we know whether a user is signed in or not.
    return null;
  }

  if (currentUser == null) {
    return (
      <>
        <PageTitle title="Connection" applicationName={applicationName} />
        <SignInPage logo={Logo} applicationName={applicationName} />
      </>
    );
  }

  if (
    !doesGroupsIntersect(currentUser.groups, authorisedGroupsForApplication)
  ) {
    return (
      <Main>
        <ErrorPage
          type={ErrorPageType.UNAUTHORIZED}
          error={
            new Error(
              "Vous n'êtes pas authorisé à accéder à cette application. Si vous pensez que c'est une erreur merci de contacter un administrateur."
            )
          }
        />
      </Main>
    );
  }

  if (
    authorisedGroupsForPage != null &&
    !doesGroupsIntersect(currentUser.groups, authorisedGroupsForPage)
  ) {
    return (
      <Main>
        <ErrorPage
          type={ErrorPageType.UNAUTHORIZED}
          error={
            new Error(
              "Vous n'êtes pas authorisé à accéder à cette page. Si vous pensez que c'est une erreur merci de contacter un administrateur."
            )
          }
          action={
            <ButtonLink href="/" variant="outlined">
              Retour
            </ButtonLink>
          }
        />
      </Main>
    );
  }

  return <CurrentUserContext.Provider value={value} children={children} />;
}

export function useCurrentUser() {
  const context = React.useContext(CurrentUserContext);
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

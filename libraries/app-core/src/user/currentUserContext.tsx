import {
  doesGroupsIntersect,
  ErrorCode,
  User,
  UserGroup,
} from "@animeaux/shared-entities";
import { ButtonLink, Main } from "@animeaux/ui-library";
import firebase from "firebase/app";
import { gql } from "graphql-request";
import invariant from "invariant";
import * as React from "react";
import { ErrorPage, ErrorPageType } from "../errorPage";
import { PageTitle } from "../page";
import { fetchGraphQL } from "../request";
import { SignInPage } from "./signInPage";
import { UserFragment } from "./userQueries";

type CurrentUserContextValue = {
  currentUser: User;
  signOut(): Promise<void>;
  updateProfile(displayName: string): Promise<void>;
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
};

const CurrentUserContext = React.createContext<CurrentUserContextValue>(null!);

async function updateProfile(displayName: string) {
  displayName = displayName.trim();

  if (displayName === "") {
    throw new Error(ErrorCode.USER_MISSING_DISPLAY_NAME);
  }

  const currentUser = firebase.auth().currentUser;
  await currentUser!.updateProfile({ displayName });
  await currentUser!.reload();
}

async function updatePassword(currentPassword: string, newPassword: string) {
  const currentUser = firebase.auth().currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(
    currentUser!.email!,
    currentPassword
  );

  await currentUser!.reauthenticateWithCredential(credential);
  await currentUser!.updatePassword(newPassword);
  await currentUser!.reload();
}

async function signOut() {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error("Could not sign out:", error);
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
      console.error("Could not set token in storage:", error);
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
    console.error("Could not get current user:", error.message);
    return null;
  }
}

type UserState = {
  hasResult: boolean;
  currentUser: User | null;
};

export type CurrentUserContextProviderProps = React.PropsWithChildren<{
  authorisedGroupsForApplication: UserGroup[];
  authorisedGroupsForPage?: UserGroup[];
  logo: React.ElementType;
  applicationName: string;
}>;

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

      setState({ hasResult: true, currentUser: user });
    });
  }, []);

  const updateProfileCallback = React.useCallback<
    CurrentUserContextValue["updateProfile"]
  >(async (profile) => {
    await updateProfile(profile);
    const user = await getCurrentUser();
    setState({ hasResult: true, currentUser: user });
  }, []);

  const value = React.useMemo<CurrentUserContextValue>(
    () => ({
      currentUser: currentUser!,
      signOut,
      updateProfile: updateProfileCallback,
      updatePassword,
    }),
    [currentUser, updateProfileCallback]
  );

  if (!hasResult) {
    // Stale the app untile we know whether a user is signed in or not.
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
  const { currentUser, ...rest } = React.useContext(CurrentUserContext);
  invariant(
    currentUser != null,
    "useCurrentUser should not be used outside of a UserContextProvider."
  );
  return { currentUser, ...rest };
}

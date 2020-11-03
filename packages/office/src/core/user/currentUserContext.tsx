import { ResourceKey, User } from "@animeaux/shared";
import firebase from "firebase/app";
import invariant from "invariant";
import * as React from "react";
import { SignInPage } from "../../ui/signInPage";
import { UnauthorisedPage } from "../../ui/unauthorisedPage";
import { fetchGraphQL, gql } from "../request";

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
    throw new Error("Un nom est obligatoire");
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

export const TOKEN_KEY = "token";

async function updateToken(firebaseUser: firebase.User | null) {
  if (firebaseUser == null) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    try {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Could not set token in storage:", error);
    }
  }
}

const CurrentUserQuery = gql`
  query CurrentUserQuery {
    user: getCurrentUser {
      id
      email
      displayName
      role {
        id
        name
        resourcePermissions
      }
    }
  }
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

export function CurrentUserContextProvider({
  resourcePermissionKey,
  children,
}: {
  resourcePermissionKey?: ResourceKey;
  children?: React.ReactNode;
}) {
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
    return <SignInPage />;
  }

  let content = children;

  if (
    resourcePermissionKey != null &&
    !currentUser.role.resourcePermissions[resourcePermissionKey]
  ) {
    content = <UnauthorisedPage />;
  }

  return <CurrentUserContext.Provider value={value} children={content} />;
}

export function useCurrentUser() {
  const { currentUser, ...rest } = React.useContext(CurrentUserContext);
  invariant(
    currentUser != null,
    "useCurrentUser should not be used outside of a UserContextProvider."
  );
  return { currentUser, ...rest };
}
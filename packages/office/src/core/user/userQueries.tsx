import { ErrorCode, User } from "@animeaux/shared";
import { gql } from "graphql.macro";
import isEqual from "lodash.isequal";
import { useAsyncMemo } from "react-behave";
import { fetchGraphQL } from "../fetchGraphQL";
import { RessourceCache } from "../ressourceCache";

const GetAllUsersQuery = gql`
  query GetAllUsersQuery {
    users: getAllUsers {
      id
      displayName
      email
      role {
        name
      }
    }
  }
`;

export function useAllUsers() {
  return useAsyncMemo<User[] | null>(
    async () => {
      const { users } = await fetchGraphQL<{ users: User[] }>(GetAllUsersQuery);
      RessourceCache.setItem("users", users);
      return users;
    },
    [],
    { initialValue: RessourceCache.getItem("users") }
  );
}

const GetUserQuery = gql`
  query GetUserQuery($id: ID!) {
    user: getUser(id: $id) {
      id
      displayName
      email
      role {
        id
        name
      }
    }
  }
`;

export function useUser(userId: string) {
  return useAsyncMemo<User | null>(
    async () => {
      const { user } = await fetchGraphQL<{ user: User | null }>(GetUserQuery, {
        variables: { id: userId },
      });

      if (user == null) {
        throw new Error(ErrorCode.USER_NOT_FOUND);
      }

      const cachedUser = RessourceCache.getItem<User | null>(`user:${userId}`);

      if (isEqual(cachedUser, user)) {
        // Return the cached value to preserve the object reference during
        // editing.
        return cachedUser;
      }

      RessourceCache.setItem(`user:${user.id}`, user);
      return user;
    },
    [userId],
    { initialValue: RessourceCache.getItem(`user:${userId}`) }
  );
}

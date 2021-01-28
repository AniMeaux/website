import {
  CreateUserPayload,
  EMAIL_PATTERN,
  ErrorCode,
  UpdateUserPayload,
  User,
  UserFormPayload,
} from "@animeaux/shared-entities";
import { useRouter } from "next/router";
import { useQueryCache } from "react-query";
import { fetchGraphQL, gql, useMutation, useQuery } from "../request";

const UserCore = gql`
  fragment UserCore on User {
    id
    displayName
    email
    disabled
  }
`;

const UserDetailed = gql`
  fragment UserDetailed on User {
    ...UserCore
    role {
      id
      name
    }
  }

  ${UserCore}
`;

const GetAllUsersQuery = gql`
  query GetAllUsersQuery {
    users: getAllUsers {
      ...UserCore
    }
  }

  ${UserCore}
`;

export function useAllUsers() {
  const { data, ...rest } = useQuery<User[], Error>("users", async () => {
    const { users } = await fetchGraphQL<{ users: User[] }>(GetAllUsersQuery);
    return users;
  });

  return [data, rest] as const;
}

const GetUserQuery = gql`
  query GetUserQuery($id: ID!) {
    user: getUser(id: $id) {
      ...UserDetailed
    }
  }

  ${UserDetailed}
`;

export function useUser(userId: string) {
  const { data, ...rest } = useQuery<User | null, Error>(
    ["user", userId],
    async () => {
      const { user } = await fetchGraphQL<
        { user: User | null },
        { id: string }
      >(GetUserQuery, { variables: { id: userId } });

      if (user == null) {
        throw new Error(ErrorCode.USER_NOT_FOUND);
      }

      return user;
    }
  );

  return [data, rest] as const;
}

const CreateUserQuery = gql`
  mutation CreateUserQuery(
    $email: String!
    $displayName: String!
    $password: String!
    $roleId: ID!
  ) {
    user: createUser(
      email: $email
      displayName: $displayName
      password: $password
      roleId: $roleId
    ) {
      ...UserDetailed
    }
  }

  ${UserDetailed}
`;

export function useCreateUser() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<User, Error, UserFormPayload>(
    async (payload) => {
      if (payload.displayName.trim() === "") {
        throw new Error(ErrorCode.USER_MISSING_DISPLAY_NAME);
      }

      if (!EMAIL_PATTERN.test(payload.email)) {
        throw new Error(ErrorCode.USER_INVALID_EMAIL);
      }

      if (payload.roleId == null) {
        throw new Error(ErrorCode.USER_MISSING_ROLE);
      }

      const createPayload: CreateUserPayload = {
        ...payload,
        // Tells TypeScript `payload.roleId` cannot be null.
        roleId: payload.roleId,
      };

      const { user } = await fetchGraphQL<{ user: User }, CreateUserPayload>(
        CreateUserQuery,
        { variables: createPayload }
      );

      router.push(`/menu/users/${user.id}`);
      return user;
    },
    {
      onSuccess(user) {
        queryCache.setQueryData(["user", user.id], user, {
          initialStale: true,
        });

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryCache.invalidateQueries("users");
      },
    }
  );
}

const UpdateUserQuery = gql`
  mutation UpdateUserQuery(
    $id: ID!
    $displayName: String
    $password: String
    $roleId: ID
  ) {
    user: updateUser(
      id: $id
      displayName: $displayName
      password: $password
      roleId: $roleId
    ) {
      ...UserDetailed
    }
  }

  ${UserDetailed}
`;

export function useUpdateUser() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<
    User,
    Error,
    { currentUser: User; formPayload: UserFormPayload }
  >(
    async ({ currentUser, formPayload }) => {
      const payload: UpdateUserPayload = {
        id: currentUser.id,
      };

      formPayload.displayName = formPayload.displayName.trim();
      if (formPayload.displayName !== currentUser.displayName) {
        if (formPayload.displayName === "") {
          throw new Error(ErrorCode.USER_MISSING_DISPLAY_NAME);
        }

        payload.displayName = formPayload.displayName;
      }

      if (formPayload.password !== "") {
        payload.password = formPayload.password;
      }

      if (
        formPayload.roleId != null &&
        formPayload.roleId !== currentUser.role.id
      ) {
        payload.roleId = formPayload.roleId;
      }

      const { user } = await fetchGraphQL<{ user: User }, UpdateUserPayload>(
        UpdateUserQuery,
        { variables: payload }
      );

      router.push(`/menu/users/${user.id}`);
      return user;
    },
    {
      onSuccess(user) {
        queryCache.setQueryData(["user", user.id], user, {
          initialStale: true,
        });

        queryCache.setQueryData<User[]>(
          "users",
          (users) => (users ?? []).map((u) => (u.id === user.id ? user : u)),
          { initialStale: true }
        );
      },
    }
  );
}

const DeleteUserQuery = gql`
  mutation DeleteUserQuery($id: ID!) {
    deleteUser(id: $id)
  }
`;

export function useDeleteUser() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<string, Error, string>(
    async (userId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteUserQuery, {
        variables: { id: userId },
      });

      router.push("/menu/users");
      return userId;
    },
    {
      onSuccess(userId) {
        queryCache.removeQueries(["user", userId]);

        queryCache.setQueryData<User[]>(
          "users",
          (users) => (users ?? []).filter((user) => user.id !== userId),
          { initialStale: true }
        );
      },
    }
  );
}

const ToggleUserBlockedStatus = gql`
  mutation ToggleUserBlockedStatus($id: ID!) {
    user: toggleUserBlockedStatus(id: $id) {
      ...UserDetailed
    }
  }

  ${UserDetailed}
`;

export function useToggleUserBlockedStatus() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<User, Error, string>(
    async (userId) => {
      const { user } = await fetchGraphQL<{ user: User }, { id: string }>(
        ToggleUserBlockedStatus,
        { variables: { id: userId } }
      );

      router.push(`/menu/users/${user.id}`);
      return user;
    },
    {
      onSuccess(user) {
        queryCache.setQueryData(["user", user.id], user, {
          initialStale: true,
        });

        queryCache.setQueryData<User[]>(
          "users",
          (users) => (users ?? []).map((u) => (u.id === user.id ? user : u)),
          { initialStale: true }
        );
      },
    }
  );
}

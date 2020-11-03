import {
  CreateUserPayload,
  EMAIL_PATTERN,
  ErrorCode,
  UpdateUserPayload,
  User,
  UserFormPayload,
} from "@animeaux/shared";
import { useRouter } from "next/router";
import { useQueryCache } from "react-query";
import { fetchGraphQL, gql, useMutation, useQuery } from "../request";

const GetAllUsersQuery = gql`
  query GetAllUsersQuery {
    users: getAllUsers {
      id
      displayName
      email
      disabled
      role {
        name
      }
    }
  }
`;

export function useAllUsers() {
  const { data, isLoading, error, ...rest } = useQuery<User[], Error>(
    "users",
    async () => {
      const { users } = await fetchGraphQL<{ users: User[] }>(GetAllUsersQuery);
      return users;
    }
  );

  return {
    ...rest,
    users: data,
    areUsersLoading: isLoading,
    usersError: error,
  };
}

const GetUserQuery = gql`
  query GetUserQuery($id: ID!) {
    user: getUser(id: $id) {
      id
      displayName
      email
      disabled
      role {
        id
        name
      }
    }
  }
`;

export function useUser(userId: string) {
  const { data, isLoading, error, ...rest } = useQuery<User | null, Error>(
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

  return {
    ...rest,
    user: data,
    isUserLoading: isLoading,
    userError: error,
  };
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
      id
      displayName
      email
      disabled
      role {
        id
        name
      }
    }
  }
`;

export function useCreateUser() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [createUser, { isLoading, error, ...rest }] = useMutation<
    User,
    Error,
    UserFormPayload
  >(
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

  return {
    ...rest,
    createUser,
    isCreateUserLoading: isLoading,
    createUserError: error,
  };
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
      id
      displayName
      email
      disabled
      role {
        id
        name
      }
    }
  }
`;

export function useUpdateUser() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [updateUser, { isLoading, error, ...rest }] = useMutation<
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

  return {
    ...rest,
    updateUser,
    isUpdateUserLoading: isLoading,
    updateUserError: error,
  };
}

const DeleteUserQuery = gql`
  mutation DeleteUserQuery($id: ID!) {
    deleteUser(id: $id)
  }
`;

export function useDeleteUser() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [deleteUser, { isLoading, error, ...rest }] = useMutation<
    string,
    Error,
    string
  >(
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

  return {
    ...rest,
    deleteUser,
    isDeleteUserLoading: isLoading,
    deleteUserError: error,
  };
}

const ToggleUserBlockedStatus = gql`
  mutation ToggleUserBlockedStatus($id: ID!) {
    user: toggleUserBlockedStatus(id: $id) {
      id
      displayName
      email
      disabled
      role {
        id
        name
      }
    }
  }
`;

export function useToggleUserBlockedStatus() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [toggleUserBlockedStatus, { isLoading, error, ...rest }] = useMutation<
    User,
    Error,
    string
  >(
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

  return {
    ...rest,
    toggleUserBlockedStatus,
    isToggleUserBlockedStatusLoading: isLoading,
    toggleUserBlockedStatusError: error,
  };
}
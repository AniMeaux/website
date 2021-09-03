import {
  CreateUserPayload,
  EMAIL_PATTERN,
  ErrorCode,
  haveSameGroups,
  UpdateUserPayload,
  User,
  UserFormPayload,
} from "@animeaux/shared-entities";
import { showSnackbar, Snackbar } from "core/popovers/snackbar";
import {
  fetchGraphQL,
  removeDataFromCache,
  setQueriesData,
  updateDataInCache,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "core/request";
import { gql } from "graphql-request";

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    displayName
    email
    disabled
    groups
  }
`;

const GetAllUsersQuery = gql`
  query GetAllUsersQuery {
    users: getAllUsers {
      ...UserFragment
    }
  }

  ${UserFragment}
`;

export function useAllUsers() {
  const queryClient = useQueryClient();

  return useQuery<User[], Error>(
    "users",
    async () => {
      const { users } = await fetchGraphQL<{ users: User[] }>(GetAllUsersQuery);
      return users;
    },
    {
      onSuccess(users) {
        // As the objects are the same for the list and the details, we set all
        // values in the cache to avoid waiting for data we already have.
        users.forEach((user) => {
          queryClient.setQueryData(["user", user.id], user);
        });
      },
    }
  );
}

const GetUserQuery = gql`
  query GetUserQuery($id: ID!) {
    user: getUser(id: $id) {
      ...UserFragment
    }
  }

  ${UserFragment}
`;

export function useUser(userId: string) {
  return useQuery<User | null, Error>(["user", userId], async () => {
    const { user } = await fetchGraphQL<{ user: User | null }, { id: string }>(
      GetUserQuery,
      { variables: { id: userId } }
    );

    if (user == null) {
      throw new Error(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  });
}

const CreateUserQuery = gql`
  mutation CreateUserQuery(
    $email: String!
    $displayName: String!
    $password: String!
    $groups: [UserGroup!]!
  ) {
    user: createUser(
      email: $email
      displayName: $displayName
      password: $password
      groups: $groups
    ) {
      ...UserFragment
    }
  }

  ${UserFragment}
`;

export function useCreateUser(
  options?: UseMutationOptions<User, Error, UserFormPayload>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<User, Error, UserFormPayload>(
    async (payload) => {
      if (payload.displayName.trim() === "") {
        throw new Error(ErrorCode.USER_MISSING_DISPLAY_NAME);
      }

      if (!EMAIL_PATTERN.test(payload.email.trim())) {
        throw new Error(ErrorCode.USER_INVALID_EMAIL);
      }

      if (payload.password.length < 6) {
        throw new Error(ErrorCode.USER_INVALID_PASSWORD);
      }

      if (payload.groups.length === 0) {
        throw new Error(ErrorCode.USER_MISSING_GROUP);
      }

      const createPayload: CreateUserPayload = payload;

      const { user } = await fetchGraphQL<{ user: User }, CreateUserPayload>(
        CreateUserQuery,
        { variables: createPayload }
      );

      return user;
    },
    {
      ...options,

      errorCodesToIgnore: [
        ErrorCode.USER_MISSING_DISPLAY_NAME,
        ErrorCode.USER_EMAIL_ALREADY_EXISTS,
        ErrorCode.USER_INVALID_EMAIL,
        ErrorCode.USER_INVALID_PASSWORD,
        ErrorCode.USER_MISSING_GROUP,
      ],

      onSuccess(user, ...rest) {
        queryClient.setQueryData(["user", user.id], user);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("users");

        showSnackbar.success(<Snackbar>Utilisateur créé</Snackbar>);

        options?.onSuccess?.(user, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const UpdateUserQuery = gql`
  mutation UpdateUserQuery(
    $id: ID!
    $displayName: String
    $password: String
    $groups: [UserGroup!]
  ) {
    user: updateUser(
      id: $id
      displayName: $displayName
      password: $password
      groups: $groups
    ) {
      ...UserFragment
    }
  }

  ${UserFragment}
`;

export function useUpdateUser(
  options?: UseMutationOptions<
    User,
    Error,
    { currentUser: User; formPayload: UserFormPayload }
  >
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
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

      if (!haveSameGroups(formPayload.groups, currentUser.groups)) {
        payload.groups = formPayload.groups;
      }

      const { user } = await fetchGraphQL<{ user: User }, UpdateUserPayload>(
        UpdateUserQuery,
        { variables: payload }
      );

      return user;
    },
    {
      ...options,

      errorCodesToIgnore: [
        ErrorCode.USER_MISSING_DISPLAY_NAME,
        ErrorCode.USER_INVALID_PASSWORD,
        ErrorCode.USER_MISSING_GROUP,
        ErrorCode.USER_IS_ADMIN,
      ],

      onSuccess(user, ...rest) {
        queryClient.setQueryData(["user", user.id], user);
        setQueriesData(queryClient, "users", updateDataInCache(user));

        showSnackbar.success(<Snackbar>Utilisateur modifié</Snackbar>);

        options?.onSuccess?.(user, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const DeleteUserQuery = gql`
  mutation DeleteUserQuery($id: ID!) {
    deleteUser(id: $id)
  }
`;

export function useDeleteUser(
  options?: UseMutationOptions<string, Error, string>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<string, Error, string>(
    async (userId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteUserQuery, {
        variables: { id: userId },
      });

      return userId;
    },
    {
      ...options,

      onSuccess(userId, ...rest) {
        queryClient.removeQueries(["user", userId]);
        setQueriesData(queryClient, "users", removeDataFromCache(userId));

        showSnackbar.success(<Snackbar>Utilisateur supprimé</Snackbar>);

        options?.onSuccess?.(userId, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const ToggleUserBlockedStatus = gql`
  mutation ToggleUserBlockedStatus($id: ID!) {
    user: toggleUserBlockedStatus(id: $id) {
      ...UserFragment
    }
  }

  ${UserFragment}
`;

export function useToggleUserBlockedStatus(
  options?: UseMutationOptions<User, Error, string>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<User, Error, string>(
    async (userId) => {
      const { user } = await fetchGraphQL<{ user: User }, { id: string }>(
        ToggleUserBlockedStatus,
        { variables: { id: userId } }
      );

      return user;
    },
    {
      ...options,

      onSuccess(user, ...rest) {
        queryClient.setQueryData(["user", user.id], user);
        setQueriesData(queryClient, "users", updateDataInCache(user));

        showSnackbar.success(<Snackbar>Utilisateur modifié</Snackbar>);

        options?.onSuccess?.(user, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

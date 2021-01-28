import {
  CreateUserPayload,
  EMAIL_PATTERN,
  ErrorCode,
  haveSameGroups,
  UpdateUserPayload,
  User,
  UserFormPayload,
} from "@animeaux/shared-entities";
import { gql } from "graphql-request";
import {
  fetchGraphQL,
  removeDataFromCache,
  updateDataInCache,
  useMutation,
  useQuery,
  useQueryClient,
} from "../request";

export const UserCore = gql`
  fragment UserCore on User {
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
      ...UserCore
    }
  }

  ${UserCore}
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
    $groups: [UserGroup!]!
  ) {
    user: createUser(
      email: $email
      displayName: $displayName
      password: $password
      groups: $groups
    ) {
      ...UserCore
    }
  }

  ${UserCore}
`;

export function useCreateUser(onSuccess?: (user: User) => void) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<User, Error, UserFormPayload>(
    async (payload) => {
      if (payload.displayName.trim() === "") {
        throw new Error(ErrorCode.USER_MISSING_DISPLAY_NAME);
      }

      if (!EMAIL_PATTERN.test(payload.email.trim())) {
        throw new Error(ErrorCode.USER_INVALID_EMAIL);
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
      onSuccess(user) {
        queryClient.setQueryData(["user", user.id], user);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("users");

        if (onSuccess != null) {
          onSuccess(user);
        }
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
      ...UserCore
    }
  }

  ${UserCore}
`;

export function useUpdateUser(onSuccess?: (user: User) => void) {
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
      onSuccess(user) {
        queryClient.setQueryData(["user", user.id], user);
        queryClient.setQueryData("users", updateDataInCache(user));

        if (onSuccess != null) {
          onSuccess(user);
        }
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

export function useDeleteUser(onSuccess?: (userId: string) => void) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<string, Error, string>(
    async (userId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteUserQuery, {
        variables: { id: userId },
      });

      return userId;
    },
    {
      onSuccess(userId) {
        queryClient.removeQueries(["user", userId]);
        queryClient.setQueryData("users", removeDataFromCache(userId));

        if (onSuccess != null) {
          onSuccess(userId);
        }
      },
    }
  );

  return [mutate, rest] as const;
}

const ToggleUserBlockedStatus = gql`
  mutation ToggleUserBlockedStatus($id: ID!) {
    user: toggleUserBlockedStatus(id: $id) {
      ...UserCore
    }
  }

  ${UserCore}
`;

export function useToggleUserBlockedStatus(onSuccess?: (user: User) => void) {
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
      onSuccess(user) {
        queryClient.setQueryData(["user", user.id], user);
        queryClient.setQueryData("users", updateDataInCache(user));

        if (onSuccess != null) {
          onSuccess(user);
        }
      },
    }
  );

  return [mutate, rest] as const;
}

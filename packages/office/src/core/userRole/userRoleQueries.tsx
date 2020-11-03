import {
  CreateUserRolePayload,
  ErrorCode,
  UpdateUserRolePayload,
  UserRole,
  UserRoleFormPayload,
} from "@animeaux/shared";
import isEqual from "lodash.isequal";
import { useRouter } from "next/router";
import {
  fetchGraphQL,
  gql,
  useMutation,
  useQuery,
  useQueryCache,
} from "../request";

const GetAllUserRolesQuery = gql`
  query GetAllUserRolesQuery {
    userRoles: getAllUserRoles {
      id
      name
      resourcePermissions
    }
  }
`;

export function useAllUserRoles() {
  const { data, isLoading, error, ...rest } = useQuery<UserRole[], Error>(
    "user-roles",
    async () => {
      const { userRoles } = await fetchGraphQL<{ userRoles: UserRole[] }>(
        GetAllUserRolesQuery
      );

      return userRoles;
    }
  );

  return {
    ...rest,
    userRoles: data,
    areUserRolesLoading: isLoading,
    userRolesError: error,
  };
}

const GetUserRoleQuery = gql`
  query GetUserRoleQuery($id: ID!) {
    userRole: getUserRole(id: $id) {
      id
      name
      resourcePermissions
      users {
        id
        displayName
        email
      }
    }
  }
`;

export function useUserRole(userRoleId: string) {
  const { data, isLoading, error, ...rest } = useQuery<UserRole | null, Error>(
    ["user-role", userRoleId],
    async () => {
      const { userRole } = await fetchGraphQL<
        { userRole: UserRole | null },
        { id: string }
      >(GetUserRoleQuery, { variables: { id: userRoleId } });

      if (userRole == null) {
        throw new Error(ErrorCode.USER_ROLE_NOT_FOUND);
      }

      return userRole;
    }
  );

  return {
    ...rest,
    userRole: data,
    isUserRoleLoading: isLoading,
    userRoleError: error,
  };
}

const CreateUserRoleQuery = gql`
  mutation CreateUserRoleQuery(
    $name: String!
    $resourcePermissions: JSONObject!
  ) {
    userRole: createUserRole(
      name: $name
      resourcePermissions: $resourcePermissions
    ) {
      id
      name
      resourcePermissions
      users {
        id
        displayName
        email
      }
    }
  }
`;

export function useCreateUserRole() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [createUserRole, { isLoading, error, ...rest }] = useMutation<
    UserRole,
    Error,
    UserRoleFormPayload
  >(
    async (payload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.USER_ROLE_MISSING_NAME);
      }

      const { userRole } = await fetchGraphQL<
        { userRole: UserRole },
        CreateUserRolePayload
      >(CreateUserRoleQuery, { variables: payload });

      router.push(`/menu/user-roles/${userRole.id}`);
      return userRole;
    },
    {
      onSuccess(userRole) {
        queryCache.setQueryData(["user-role", userRole.id], userRole, {
          initialStale: true,
        });

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryCache.invalidateQueries("user-roles");
      },
    }
  );

  return {
    ...rest,
    createUserRole,
    isCreateUserRoleLoading: isLoading,
    createUserError: error,
  };
}

const UpdateUserRoleQuery = gql`
  mutation UpdateUserRoleQuery(
    $id: ID!
    $name: String
    $resourcePermissions: JSONObject
  ) {
    userRole: updateUserRole(
      id: $id
      name: $name
      resourcePermissions: $resourcePermissions
    ) {
      id
      name
      resourcePermissions
      users {
        id
        displayName
        email
      }
    }
  }
`;

export function useUpdateUserRole() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [updateUserRole, { isLoading, error, ...rest }] = useMutation<
    UserRole,
    Error,
    { currentUserRole: UserRole; formPayload: UserRoleFormPayload }
  >(
    async ({ currentUserRole, formPayload }) => {
      const payload: UpdateUserRolePayload = {
        id: currentUserRole.id,
      };

      formPayload.name = formPayload.name.trim();
      if (formPayload.name !== currentUserRole.name) {
        if (formPayload.name === "") {
          throw new Error(ErrorCode.USER_ROLE_MISSING_NAME);
        }

        payload.name = formPayload.name;
      }

      if (
        !isEqual(
          formPayload.resourcePermissions,
          currentUserRole.resourcePermissions
        )
      ) {
        payload.resourcePermissions = formPayload.resourcePermissions;
      }

      const { userRole } = await fetchGraphQL<
        { userRole: UserRole },
        UpdateUserRolePayload
      >(UpdateUserRoleQuery, { variables: payload });

      router.push(`/menu/user-roles/${userRole.id}`);
      return userRole;
    },
    {
      onSuccess(userRole) {
        queryCache.setQueryData(["user-role", userRole.id], userRole, {
          initialStale: true,
        });

        queryCache.setQueryData<UserRole[]>(
          "user-roles",
          (userRoles) =>
            (userRoles ?? []).map((u) => (u.id === userRole.id ? userRole : u)),
          { initialStale: true }
        );
      },
    }
  );

  return {
    ...rest,
    updateUserRole,
    isUpdateUserRoleLoading: isLoading,
    updateUserRoleError: error,
  };
}

const DeleteUserRoleQuery = gql`
  mutation DeleteUserRoleQuery($id: ID!) {
    deleteUserRole(id: $id)
  }
`;

export function useDeleteUserRole() {
  const router = useRouter();
  const queryCache = useQueryCache();

  const [deleteUserRole, { isLoading, error, ...rest }] = useMutation<
    string,
    Error,
    string
  >(
    async (userRoleId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteUserRoleQuery, {
        variables: { id: userRoleId },
      });

      router.push("/menu/user-roles");
      return userRoleId;
    },
    {
      onSuccess(userRoleId) {
        queryCache.removeQueries(["user-role", userRoleId]);

        queryCache.setQueryData<UserRole[]>(
          "user-roles",
          (userRoles) =>
            (userRoles ?? []).filter((userRole) => userRole.id !== userRoleId),
          { initialStale: true }
        );
      },
    }
  );

  return {
    ...rest,
    deleteUserRole,
    isDeleteUserRoleLoading: isLoading,
    deleteUserRoleError: error,
  };
}

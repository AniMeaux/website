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
  const { data, ...rest } = useQuery<UserRole[], Error>(
    "user-roles",
    async () => {
      const { userRoles } = await fetchGraphQL<{ userRoles: UserRole[] }>(
        GetAllUserRolesQuery
      );

      return userRoles;
    }
  );

  return { ...rest, userRoles: data };
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
  const { data, ...rest } = useQuery<UserRole | null, Error>(
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

  return { ...rest, userRole: data };
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

  return useMutation<UserRole, Error, UserRoleFormPayload>(
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
      onSuccess() {
        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryCache.invalidateQueries("user-roles");
      },
    }
  );
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

  return useMutation<
    UserRole,
    Error,
    { currentUserRole: UserRole; formPayload: UserRoleFormPayload }
  >(
    async ({ currentUserRole, formPayload }) => {
      formPayload.name = formPayload.name.trim();

      const payload: UpdateUserRolePayload = {
        id: currentUserRole.id,
      };

      if (formPayload.name !== currentUserRole.name) {
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

      if (payload.name === "") {
        throw new Error(ErrorCode.USER_ROLE_MISSING_NAME);
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
        queryCache.setQueryData<UserRole[]>(
          "user-roles",
          (userRoles) =>
            (userRoles ?? []).map((u) => (u.id === userRole.id ? userRole : u)),
          { initialStale: true }
        );

        queryCache.setQueryData(["user-role", userRole.id], userRole, {
          initialStale: true,
        });
      },
    }
  );
}

const DeleteUserRoleQuery = gql`
  mutation DeleteUserRoleQuery($id: ID!) {
    deleteUserRole(id: $id)
  }
`;

export function useDeleteUserRole() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<string, Error, string>(
    async (userRoleId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteUserRoleQuery, {
        variables: { id: userRoleId },
      });

      router.push("/menu/user-roles");
      return userRoleId;
    },
    {
      onSuccess(userRoleId) {
        queryCache.setQueryData<UserRole[]>(
          "user-roles",
          (userRoles) =>
            (userRoles ?? []).filter((userRole) => userRole.id !== userRoleId),
          { initialStale: true }
        );

        queryCache.removeQueries(["user-role", userRoleId]);
      },
    }
  );
}

import {
  CreateUserRolePayload,
  ErrorCode,
  ResourceKey,
  UpdateUserRolePayload,
  UserRole,
  UserRoleFormPayload,
} from "@animeaux/shared";
import { gql } from "graphql.macro";
import isEqual from "lodash.isequal";
import { useRouter } from "next/router";
import * as React from "react";
import { AsyncState, useAsyncCallback, useAsyncMemo } from "react-behave";
import {
  FaDna,
  FaFileAlt,
  FaHandshake,
  FaHome,
  FaShieldAlt,
  FaTag,
  FaUser,
} from "react-icons/fa";
import Logo from "../ui/logo.svg";
import { fetchGraphQL } from "./fetchGraphQL";
import { RessourceCache } from "./ressourceCache";

const ResourceIcons: { [key in ResourceKey]: React.ElementType } = {
  animal: Logo,
  animal_breed: FaDna,
  animal_characteristic: FaTag,
  blog: FaFileAlt,
  host_family: FaHome,
  partner: FaHandshake,
  user: FaUser,
  user_role: FaShieldAlt,
};

export type ResourceIconProps = React.SVGAttributes<HTMLOrSVGElement> & {
  resourceKey: ResourceKey;
};

export function ResourceIcon({ resourceKey, ...rest }: ResourceIconProps) {
  const Icon = ResourceIcons[resourceKey];
  return <Icon {...rest} />;
}

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
  return useAsyncMemo<UserRole[] | null>(
    async () => {
      const { userRoles } = await fetchGraphQL<{ userRoles: UserRole[] }>(
        GetAllUserRolesQuery
      );

      RessourceCache.setItem("userRoles", userRoles);
      return userRoles;
    },
    [],
    { initialValue: RessourceCache.getItem("userRoles") }
  );
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
  return useAsyncMemo<UserRole | null>(
    async () => {
      const { userRole } = await fetchGraphQL<
        { userRole: UserRole | null },
        { id: string }
      >(GetUserRoleQuery, { variables: { id: userRoleId } });

      if (userRole == null) {
        throw new Error(ErrorCode.USER_ROLE_NOT_FOUND);
      }

      RessourceCache.setItem(`userRole:${userRole.id}`, userRole);
      return userRole;
    },
    [userRoleId],
    { initialValue: RessourceCache.getItem(`userRole:${userRoleId}`) }
  );
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

export function useCreateUserRole(): [
  (payload: UserRoleFormPayload) => Promise<void>,
  AsyncState<void>
] {
  const router = useRouter();
  return useAsyncCallback(
    async (payload: UserRoleFormPayload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.USER_ROLE_MISSING_NAME);
      }

      const { userRole } = await fetchGraphQL<
        { userRole: UserRole },
        CreateUserRolePayload
      >(CreateUserRoleQuery, { variables: payload });

      RessourceCache.setItem(`userRole:${userRole.id}`, userRole);
      router.push(`/menu/user-roles/${userRole.id}`);
    },
    [router]
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

export function useUpdateUserRole(): [
  (currentUserRole: UserRole, payload: UserRoleFormPayload) => Promise<void>,
  AsyncState<void>
] {
  const router = useRouter();
  return useAsyncCallback(
    async (currentUserRole: UserRole, formPayload: UserRoleFormPayload) => {
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

      RessourceCache.setItem(`userRole:${userRole.id}`, userRole);
      router.push(`/menu/user-roles/${userRole.id}`);
    },
    [router]
  );
}

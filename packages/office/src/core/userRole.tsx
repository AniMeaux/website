import {
  CreateUserRolePayload,
  ErrorCode,
  ResourceKey,
  UserRole,
} from "@animeaux/shared";
import { gql } from "graphql.macro";
import { useRouter } from "next/router";
import * as React from "react";
import { useAsyncCallback, useAsyncMemo } from "react-behave";
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

export function useCreateUserRole() {
  const router = useRouter();
  return useAsyncCallback(
    async (payload: CreateUserRolePayload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.USER_ROLE_MISSING_NAME);
      }

      const { userRole } = await fetchGraphQL<
        { userRole: UserRole },
        CreateUserRolePayload
      >(CreateUserRoleQuery, { variables: payload });

      RessourceCache.setItem(`userRole:${userRole.id}`, userRole);
      router.push(
        "/menu/user-roles/[userRoleId]",
        `/menu/user-roles/${userRole.id}`
      );
    },
    [router]
  );
}

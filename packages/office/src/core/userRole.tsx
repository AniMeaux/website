import {
  CreateUserRolePayload,
  ErrorCode,
  ResourceKey,
  UserRole,
} from "@animeaux/shared";
import { gql } from "graphql.macro";
import { useRouter } from "next/router";
import { useAsyncCallback, useAsyncMemo } from "react-behave";
import {
  FaDna,
  FaHandshake,
  FaHome,
  FaParagraph,
  FaShieldAlt,
  FaTag,
  FaUser,
} from "react-icons/fa";
import Logo from "../ui/logo.svg";
import { fetchGraphQL } from "./fetchGraphQL";
import { RessourceCache } from "./ressourceCache";

export const ResourceIcons: { [key in ResourceKey]: React.ElementType } = {
  animal: Logo,
  animal_breed: FaDna,
  animal_characteristic: FaTag,
  blog: FaParagraph,
  host_family: FaHome,
  partner: FaHandshake,
  user: FaUser,
  user_role: FaShieldAlt,
};

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

import { UserRole } from "@animeaux/shared";
import { gql } from "graphql.macro";
import { useAsyncMemo } from "react-behave";
import { fetchGraphQL } from "./fetchGraphQL";
import { RessourceCache } from "./ressourceCache";

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

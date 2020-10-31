import { ErrorCode, User } from "@animeaux/shared";
import { fetchGraphQL, gql, useQuery } from "../request";

const GetAllUsersQuery = gql`
  query GetAllUsersQuery {
    users: getAllUsers {
      id
      displayName
      email
      role {
        name
      }
    }
  }
`;

export function useAllUsers() {
  const { data, ...rest } = useQuery<User[], Error>("users", async () => {
    const { users } = await fetchGraphQL<{ users: User[] }>(GetAllUsersQuery);
    return users;
  });

  return { ...rest, users: data };
}

const GetUserQuery = gql`
  query GetUserQuery($id: ID!) {
    user: getUser(id: $id) {
      id
      displayName
      email
      role {
        id
        name
      }
    }
  }
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

  return { ...rest, user: data };
}

import { ErrorCode } from "@animeaux/shared-entities";
import { firebase } from "core/firebase";
import { FetchGraphQLOptions, publicFetchGraphQL } from "./publicFetchGraphQL";

export async function fetchGraphQL<DataType = null, Variables = object>(
  query: string,
  { variables }: FetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  try {
    return await publicFetchGraphQL(query, {
      variables,
      headers: {
        Authorisation: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    if (error.message === ErrorCode.AUTH_NOT_AUTHENTICATED) {
      const currentUser = firebase.auth().currentUser;

      // Re-try the call after refreshing the token.
      if (currentUser != null) {
        await currentUser.reload();
        return await publicFetchGraphQL(query, {
          variables,
          headers: {
            Authorisation: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
    }

    throw error;
  }
}

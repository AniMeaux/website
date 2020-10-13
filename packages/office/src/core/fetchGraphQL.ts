import { DocumentNode } from "graphql";
import { IncomingMessage } from "http";
import { TOKEN_KEY } from "./user";

type fetchGraphQLOptions<Variables> = {
  variables?: Variables;
  req?: IncomingMessage;
};

export async function fetchGraphQL<DataType = null, Variables = object>(
  query: DocumentNode,
  { variables, req }: fetchGraphQLOptions<Variables> = {}
): Promise<DataType> {
  const body: any = {
    query: query.loc!.source.body,
  };

  if (variables != null) {
    body.variables = variables;
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorisation: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  // Handle GraphQL errors.
  if (json.errors != null && json.errors.length > 0) {
    const message = json.errors.map((error: Error) => error.message).join("\n");
    throw new Error(message);
  }

  return json.data;
}

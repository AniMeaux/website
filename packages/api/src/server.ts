import { DBUserForQueryContext } from "@animeaux/shared";
import { ApolloServer, gql } from "apollo-server";
import { IncomingMessage } from "http";
import { ListenOptions } from "net";
import { AuthDirective } from "./authDirective";
import { database } from "./database";
import { AuthContext } from "./model/shared";
import { UserModel } from "./model/user";
import { UserRoleModel } from "./model/userRole";

const SERVER_OPTIONS: ListenOptions = {
  port: +process.env.PORT,
};

const rootTypeDefs = gql`
  scalar JSONObject

  type Query
  type Mutation
`;

const apolloServer = new ApolloServer({
  context: async ({ req }: { req: IncomingMessage }): Promise<AuthContext> => {
    const token = (req.headers.authorisation as string)?.replace("Bearer ", "");

    let user: DBUserForQueryContext | null = null;

    if (token != null) {
      user = await database.getUserForQueryContext(token);
    }

    return { user };
  },
  typeDefs: [
    rootTypeDefs,
    AuthDirective.typeDefs,
    UserRoleModel.typeDefs,
    UserModel.typeDefs,
  ],
  schemaDirectives: Object.assign({}, AuthDirective.schemaDirectives),
  resolvers: Object.assign(UserModel.resolvers, UserRoleModel.resolvers, {
    Query: Object.assign({}, UserRoleModel.queries, UserModel.queries),
    Mutation: Object.assign({}, UserRoleModel.mutations, UserModel.mutations),
  }),
});

export const Server = {
  start() {
    database.initialize();

    apolloServer.listen(SERVER_OPTIONS).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  },
};

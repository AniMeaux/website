import { User } from "@animeaux/shared-entities";
import { ApolloServer, gql } from "apollo-server";
import { IncomingMessage } from "http";
import { ListenOptions } from "net";
import { AuthDirective } from "./authDirective";
import { database } from "./database";
// import { AnimalBreedModel } from "./model/animalBreed";
// import { HostFamilyModel } from "./model/hostFamily";
import { AuthContext } from "./model/shared";
import { UserModel } from "./model/user";

const SERVER_OPTIONS: ListenOptions = {
  port: Number(process.env.PORT),
};

const rootTypeDefs = gql`
  scalar JSONObject

  type Query
  type Mutation
`;

const apolloServer = new ApolloServer({
  context: async ({ req }: { req: IncomingMessage }): Promise<AuthContext> => {
    const token = (req.headers.authorisation as string)?.replace("Bearer ", "");

    let user: User | null = null;

    if (token != null) {
      user = await database.getUserForQueryContext(token);
    }

    return { user };
  },
  typeDefs: [
    rootTypeDefs,
    AuthDirective.typeDefs,
    UserModel.typeDefs,
    // AnimalBreedModel.typeDefs,
    // HostFamilyModel.typeDefs,
  ],
  schemaDirectives: Object.assign({}, AuthDirective.schemaDirectives),
  resolvers: Object.assign({
    Query: Object.assign(
      {},
      UserModel.queries
      // AnimalBreedModel.queries,
      // HostFamilyModel.queries
    ),
    Mutation: Object.assign(
      {},
      UserModel.mutations
      // AnimalBreedModel.mutations,
      // HostFamilyModel.mutations
    ),
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

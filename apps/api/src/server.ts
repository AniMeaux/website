import { User } from "@animeaux/shared-entities";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer, gql } from "apollo-server";
import { IncomingMessage } from "http";
import { ListenOptions } from "net";
import { AuthDirective } from "./authDirective";
import { database } from "./database";
import { AnimalModel } from "./model/animal";
import { AnimalBreedModel } from "./model/animalBreed";
import { AnimalColorModel } from "./model/animalColor";
import { HostFamilyModel } from "./model/hostFamily";
import { ImageModel } from "./model/image";
import { AuthContext } from "./model/shared";
import { UserModel } from "./model/user";

const SERVER_OPTIONS: ListenOptions = {
  port: Number(process.env.PORT),
};

const rootTypeDefs = gql`
  scalar JSONObject

  enum Trilean {
    TRUE
    FALSE
    UNKNOWN
  }

  type Query
  type Mutation
`;

const allowedOrigines = [/^https:\/\/.*\.animeaux\.org$/];

if (process.env.NODE_ENV === "development") {
  allowedOrigines.push(/^http:\/\/localhost/);
}

let schema = makeExecutableSchema({
  typeDefs: [
    rootTypeDefs,
    AuthDirective.typeDefs,
    UserModel.typeDefs,
    AnimalBreedModel.typeDefs,
    AnimalColorModel.typeDefs,
    HostFamilyModel.typeDefs,
    AnimalModel.typeDefs,
    ImageModel.typeDefs,
  ],
  resolvers: Object.assign(
    {
      Query: Object.assign(
        {},
        UserModel.queries,
        AnimalBreedModel.queries,
        AnimalColorModel.queries,
        HostFamilyModel.queries,
        AnimalModel.queries,
        ImageModel.queries
      ),
      Mutation: Object.assign(
        {},
        UserModel.mutations,
        AnimalBreedModel.mutations,
        AnimalColorModel.mutations,
        HostFamilyModel.mutations,
        AnimalModel.mutations
      ),
    },
    AnimalModel.resolvers
  ),
});

schema = AuthDirective.schemaTransformer(schema);

const apolloServer = new ApolloServer({
  cors: { origin: allowedOrigines },

  context: async ({ req }: { req: IncomingMessage }): Promise<AuthContext> => {
    const token = (req.headers.authorisation as string)?.replace("Bearer ", "");

    let user: User | null = null;

    if (token != null) {
      user = await database.getUserForQueryContext(token);
    }

    return { user };
  },
  schema,
});

export const Server = {
  start() {
    database.initialize();

    apolloServer.listen(SERVER_OPTIONS).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  },
};

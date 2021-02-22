import { CloudinaryApiSignature } from "@animeaux/shared-entities";
import { gql, IResolverObject } from "apollo-server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const typeDefs = gql`
  type CloudinaryApiSignature {
    timestamp: String!
    signature: String!
  }

  extend type Query {
    getCloudinaryApiSignature(publicId: String!): CloudinaryApiSignature!
      @auth(groups: [ADMIN, ANIMAL_MANAGER])
  }
`;

const queries: IResolverObject = {
  getCloudinaryApiSignature: async (
    parent: any,
    { publicId }: { publicId: string }
  ): Promise<CloudinaryApiSignature> => {
    const timestamp = Date.now();

    return {
      timestamp: String(timestamp),
      signature: cloudinary.utils.api_sign_request(
        { timestamp, public_id: publicId },
        process.env.CLOUDINARY_API_SECRET
      ),
    };
  },
};

export const ImageModel = {
  typeDefs,
  queries,
};

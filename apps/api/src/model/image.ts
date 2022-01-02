import { CloudinaryApiSignature } from "@animeaux/shared-entities";
import { gql } from "apollo-server";
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
    getCloudinaryApiSignature(
      parametersToSign: JSONObject!
    ): CloudinaryApiSignature! @auth(groups: [ADMIN, ANIMAL_MANAGER])
  }
`;

const queries = {
  getCloudinaryApiSignature: async (
    parent: any,
    { parametersToSign }: { parametersToSign: object }
  ): Promise<CloudinaryApiSignature> => {
    const timestamp = Date.now();

    return {
      timestamp: String(timestamp),
      signature: cloudinary.utils.api_sign_request(
        { timestamp, ...parametersToSign },
        process.env.CLOUDINARY_API_SECRET
      ),
    };
  },
};

export const ImageModel = {
  typeDefs,
  queries,
};

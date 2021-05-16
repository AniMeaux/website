import { PublicSearchableAnimal } from "@animeaux/shared-entities/build/animal";
import { PaginatedResponse } from "@animeaux/shared-entities/build/pagination";
import { gql } from "graphql-request";

export const PublicSearchableAnimalFragment = gql`
  fragment PublicSearchableAnimalFragment on PublicSearchableAnimal {
    id
    officialName
    birthdate
    gender
    species
    breed {
      id
      name
      species
    }
    color {
      id
      name
    }
    avatarId
    isOkChildren
    isOkDogs
    isOkCats
    isSterilized
  }
`;

export type PageQueryProps =
  | { type: "success"; response: PaginatedResponse<PublicSearchableAnimal> }
  | { type: "error" };

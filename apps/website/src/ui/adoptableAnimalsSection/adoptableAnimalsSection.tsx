import { PublicAnimal } from "@animeaux/shared-entities/build/animal";
import { formatAge } from "@animeaux/shared-entities/build/date";
import {
  PaginatedRequestParameters,
  PaginatedResponse,
} from "@animeaux/shared-entities/build/pagination";
import * as Sentry from "@sentry/react";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import * as React from "react";
import { FaArrowRight, FaPaw } from "react-icons/fa";
import { publicFetchGraphQL } from "../../core/fetchGraphQL";
import { Link } from "../../core/link";
import { Image } from "../image";

const PublicAnimalFragment = gql`
  fragment PublicAnimalFragment on PublicAnimal {
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

const GetAllAdoptableAnimalsQuery = gql`
  query GetAllAdoptableAnimals($page: Int) {
    response: getAllAdoptableAnimals(page: $page) {
      hits {
        ...PublicAnimalFragment
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${PublicAnimalFragment}
`;

type AdoptableAnimalsSectionProps = {
  animals: PublicAnimal[];
};

export const getServerSideProps: GetServerSideProps<AdoptableAnimalsSectionProps> = async () => {
  let animals: PublicAnimal[] = [];

  try {
    const { response } = await publicFetchGraphQL<
      { response: PaginatedResponse<PublicAnimal> },
      PaginatedRequestParameters
    >(GetAllAdoptableAnimalsQuery, {
      variables: { page: 0 },
    });

    animals = response.hits;
  } catch (error) {
    Sentry.captureException(error, {
      extra: { query: "getAllAdoptableAnimals" },
    });
  }

  return { props: { animals } };
};

export function AdoptableAnimalsSection({
  animals,
}: AdoptableAnimalsSectionProps) {
  return (
    <section className="AdoptableAnimalsSection">
      <ul className="AdoptableAnimalsList">
        {animals.slice(0, 5).map((animal) => {
          const largeImage = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${animal.avatarId}`;

          return (
            <li key={animal.id} className="AdoptableAnimalsListItem">
              <Link
                href={`/animals/${animal.id}`}
                className="AdoptableAnimalsLink"
              >
                <Image
                  alt={animal.officialName}
                  largeImage={largeImage}
                  smallImage={largeImage}
                  className="AdoptableAnimalImage"
                />

                <div className="AdoptableAnimalContent">
                  <h3 className="AdoptableAnimalName">{animal.officialName}</h3>
                  <p className="AdoptableAnimalInfo">
                    {formatAge(animal.birthdate)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}

        <li className="AdoptableAnimalsListItem">
          <Link href="/search" className="AdoptableAnimalsLink">
            <span className="AdoptableAnimalIcon">
              <FaPaw />
            </span>

            <div className="AdoptableAnimalContent">
              <h3 className="AdoptableAnimalName">En voir plus</h3>
            </div>

            <FaArrowRight />
          </Link>
        </li>
      </ul>
    </section>
  );
}

import { publicFetchGraphQL } from "@animeaux/app-core/build/request/publicFetchGraphQL";
import { PublicAnimal } from "@animeaux/shared-entities/build/animal";
import {
  PaginatedRequestParameters,
  PaginatedResponse,
} from "@animeaux/shared-entities/build/pagination";
import * as Sentry from "@sentry/react";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import * as React from "react";
import { Footer } from "../core/footer";
import { Header } from "../core/header";
import { PageTitle } from "../core/pageTitle";
import { SearchForm } from "../core/searchForm";
import { HeroSection } from "../ui/heroSection";
import {
  StatisticImage,
  StatisticItem,
  StatisticsSection,
} from "../ui/statisticsSection";

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

export type HomePageProps = {
  animals: PublicAnimal[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
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

export default function HomePage({ animals }: HomePageProps) {
  console.log("animals:", animals);

  return (
    <>
      <PageTitle />
      <Header />

      <main>
        <HeroSection
          title="Adoptez-moi"
          subTitle="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance"
          smallImage="/landing-image.jpg"
          largeImage="/landing-image@2x.jpg"
          searchForm={<SearchForm />}
        />

        <StatisticsSection>
          <StatisticItem
            value="3 ans"
            title="D'existences"
            image={
              <StatisticImage
                alt="Anniversaire"
                smallImage="/birthday.jpg"
                largeImage="/birthday@2x.jpg"
              />
            }
          />

          <StatisticItem
            value="400"
            title="Prises en charge"
            image={
              <StatisticImage
                alt="Prise en charge"
                smallImage="/pick-up.jpg"
                largeImage="/pick-up.jpg"
              />
            }
          />

          <StatisticItem
            value="28"
            title="Bénévoles"
            image={
              <StatisticImage
                alt="Bénévoles"
                smallImage="/volunteers.jpg"
                largeImage="/volunteers.jpg"
              />
            }
          />
        </StatisticsSection>
      </main>

      <Footer />
    </>
  );
}

import {
  AnimalAgesLabels,
  AnimalSpeciesLabels,
  PublicAnimal,
  PublicAnimalFilters,
} from "@animeaux/shared-entities/build/animal";
import {
  PaginatedRequestParameters,
  PaginatedResponse,
} from "@animeaux/shared-entities/build/pagination";
import * as Sentry from "@sentry/react";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import { fetchGraphQL } from "~/core/fetchGraphQL";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { Error } from "~/dataDisplay/error/error";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { SearchFormSection } from "./searchFormSection";
import { SearchResults } from "./searchResults";

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
  query GetAllAdoptableAnimals(
    $page: Int
    $species: AnimalSpecies
    $age: AnimalAge
  ) {
    response: getAllAdoptableAnimals(
      page: $page
      species: $species
      age: $age
    ) {
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

type AdoptPageProps =
  | { response: PaginatedResponse<PublicAnimal> }
  | { hasError: boolean };

type AdoptPage = {
  getServerSideProps: GetServerSideProps<AdoptPageProps>;
  AdoptPage: PageComponent<AdoptPageProps>;
};

export function createAdoptPage(searchParams: AdoptSearchParams): AdoptPage {
  const getServerSideProps: GetServerSideProps<AdoptPageProps> = async ({
    res,
  }) => {
    try {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<PublicAnimal> },
        PaginatedRequestParameters<PublicAnimalFilters>
      >(GetAllAdoptableAnimalsQuery, {
        variables: {
          page: 0,
          species: searchParams.animalSpecies,
          age: searchParams.animalAge,
        },
      });

      return { props: { response } };
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          query: "getAllAdoptableAnimals",
          searchParams: searchParams.toString(),
        },
      });

      res.statusCode = 500;

      return { props: { hasError: true } };
    }
  };

  let pageTitle = "À l'adoption";

  if (searchParams.animalAge != null) {
    pageTitle = `${
      AnimalAgesLabels[searchParams.animalAge]
    } ${pageTitle}`.toLowerCase();
  }

  if (searchParams.animalSpecies != null) {
    pageTitle = `${
      AnimalSpeciesLabels[searchParams.animalSpecies]
    } ${pageTitle}`;
  }

  const AdoptPage: PageComponent<AdoptPageProps> = (props) => {
    let content: React.ReactNode;
    if ("hasError" in props) {
      content = <Error type="serverError" />;
    } else {
      content = (
        <>
          <SearchFormSection searchParams={searchParams} />
          <SearchResults
            response={props.response}
            searchParams={searchParams}
          />
        </>
      );
    }

    return (
      <main>
        <PageTitle title={pageTitle} />
        {content}
      </main>
    );
  };

  AdoptPage.renderLayout = (children) => (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );

  return { getServerSideProps, AdoptPage };
}

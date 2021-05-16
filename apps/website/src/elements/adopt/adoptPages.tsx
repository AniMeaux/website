import {
  AnimalAgesLabels,
  AnimalSpeciesLabels,
  PublicAnimalFilters,
  PublicSearchableAnimal,
} from "@animeaux/shared-entities/build/animal";
import {
  PaginatedRequestParameters,
  PaginatedResponse,
} from "@animeaux/shared-entities/build/pagination";
import * as Sentry from "@sentry/react";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import { AdoptSearchParams } from "~/core/adoptSearchParams";
import {
  PageQueryProps,
  PublicSearchableAnimalFragment,
} from "~/core/animalQueries";
import { fetchGraphQL } from "~/core/fetchGraphQL";
import { PageComponent } from "~/core/pageComponent";
import { PageQueryParam } from "~/core/pageQueryParam";
import { PageTitle } from "~/core/pageTitle";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { ErrorPage } from "~/pages/_error";
import { SearchFormSection } from "./searchFormSection";
import { SearchResults } from "./searchResults";

const GetAllAdoptableAnimalsQuery = gql`
  query GetAllAdoptableAnimals(
    $page: Int
    $hitsPerPage: Int
    $species: AnimalSpecies
    $age: AnimalAge
  ) {
    response: getAllAdoptableAnimals(
      page: $page
      hitsPerPage: $hitsPerPage
      species: $species
      age: $age
    ) {
      hits {
        ...PublicSearchableAnimalFragment
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${PublicSearchableAnimalFragment}
`;

async function fetchAllAdoptableAnimals(
  searchParams: AdoptSearchParams,
  page: number
): Promise<PageQueryProps> {
  try {
    const { response } = await fetchGraphQL<
      { response: PaginatedResponse<PublicSearchableAnimal> },
      PaginatedRequestParameters<PublicAnimalFilters>
    >(GetAllAdoptableAnimalsQuery, {
      variables: {
        page,
        // Multiple of 2 and 3 to be nicely displayed.
        hitsPerPage: 18,
        species: searchParams.animalSpecies,
        age: searchParams.animalAge,
      },
    });

    return { type: "success", response };
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        query: "getAllAdoptableAnimals",
        page,
        searchParams: searchParams.toString(),
      },
    });

    return { type: "error" };
  }
}

type AdoptPage = {
  getServerSideProps: GetServerSideProps<PageQueryProps>;
  AdoptPage: PageComponent<PageQueryProps>;
};

export function createAdoptPage(searchParams: AdoptSearchParams): AdoptPage {
  const getServerSideProps: GetServerSideProps<PageQueryProps> = async ({
    query,
    res,
  }) => {
    const queryParams = PageQueryParam.fromQuery(query);
    const props = await fetchAllAdoptableAnimals(
      searchParams,
      queryParams.page
    );

    if (props.type === "error") {
      res.statusCode = 500;
    }

    return { props };
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

  const AdoptPage: PageComponent<PageQueryProps> = (props) => {
    if (props.type === "error") {
      return <ErrorPage type="serverError" title={pageTitle} />;
    }

    return (
      <main>
        <PageTitle title={pageTitle} />
        <SearchFormSection searchParams={searchParams} />
        <SearchResults response={props.response} searchParams={searchParams} />
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

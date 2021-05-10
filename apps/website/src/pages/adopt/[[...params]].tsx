import {
  AnimalAgesBySpecies,
  AnimalAgesLabels,
  AnimalSpeciesLabels,
  ANIMAL_SPECIES_ALPHABETICAL_ORDER,
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
import { SearchFormSection } from "~/elements/adopt/searchFormSection";
import { SearchResults } from "~/elements/adopt/searchResults";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { NotFoundPage } from "~/pages/404";

function createPagesWhitelist() {
  const whitelist: Record<string, boolean> = {
    "": true,
  };

  ANIMAL_SPECIES_ALPHABETICAL_ORDER.forEach((species) => {
    const speciesKey = species.toLowerCase();
    whitelist[speciesKey] = true;

    AnimalAgesBySpecies[species].forEach((age) => {
      whitelist[[speciesKey, age.toLowerCase()].join("/")] = true;
    });
  });

  return whitelist;
}

const PAGES_WHITELIST = createPagesWhitelist();

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
  | { response: PaginatedResponse<PublicAnimal>; params: string[] }
  | { isPageNotFound: boolean }
  | { hasError: boolean; params: string[] };

export const getServerSideProps: GetServerSideProps<AdoptPageProps> = async ({
  query,
}) => {
  const params = (query.params as string[]) ?? [];
  if (!PAGES_WHITELIST[params.join("/")]) {
    return { props: { isPageNotFound: true } };
  }

  const adoptSearchParams = AdoptSearchParams.fromParams(params);

  try {
    const { response } = await fetchGraphQL<
      { response: PaginatedResponse<PublicAnimal> },
      PaginatedRequestParameters<PublicAnimalFilters>
    >(GetAllAdoptableAnimalsQuery, {
      variables: {
        page: 0,
        species: adoptSearchParams.animalSpecies,
        age: adoptSearchParams.animalAge,
      },
    });

    return { props: { response, params } };
  } catch (error) {
    Sentry.captureException(error, {
      extra: { query: "getAllAdoptableAnimals" },
    });

    return { props: { hasError: true, params } };
  }
};

const AdoptPage: PageComponent<AdoptPageProps> = (props) => {
  if ("isPageNotFound" in props) {
    return <NotFoundPage />;
  }

  const adoptSearchParams = AdoptSearchParams.fromParams(props.params);

  let title = "À l'adoption";
  if (adoptSearchParams.animalAge != null) {
    title = `${
      AnimalAgesLabels[adoptSearchParams.animalAge]
    } ${title}`.toLowerCase();
  }

  if (adoptSearchParams.animalSpecies != null) {
    title = `${AnimalSpeciesLabels[adoptSearchParams.animalSpecies]} ${title}`;
  }

  let content: React.ReactNode;
  if ("hasError" in props) {
    content = <Error type="serverError" />;
  } else {
    content = (
      <>
        <SearchFormSection searchParams={adoptSearchParams} />
        <SearchResults
          response={props.response}
          searchParams={adoptSearchParams}
        />
      </>
    );
  }

  return (
    <main>
      <PageTitle title={title} />
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

export default AdoptPage;

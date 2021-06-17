import { PublicSearchableAnimal } from "@animeaux/shared-entities/build/animal";
import {
  PaginatedRequestParameters,
  PaginatedResponse,
} from "@animeaux/shared-entities/build/pagination";
import {
  PageQueryProps,
  PublicSearchableAnimalFragment,
} from "core/animalQueries";
import { fetchGraphQL } from "core/fetchGraphQL";
import { PageComponent } from "core/pageComponent";
import { PageQueryParam } from "core/pageQueryParam";
import { PageTitle } from "core/pageTitle";
import { captureException } from "core/sentry";
import { AnimalCard } from "dataDisplay/animal/card";
import { AnimalPaginatedList } from "dataDisplay/animal/paginatedList";
import { gql } from "graphql-request";
import { CenteredContent } from "layout/centeredContent";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { PageHeader } from "layout/pageHeader";
import { Section } from "layout/section";
import { GetServerSideProps } from "next";
import { ErrorPage } from "pages/_error";

const GetAllSavedAnimalsQuery = gql`
  query GetAllSavedAnimalsQuery($page: Int, $hitsPerPage: Int) {
    response: getAllSavedAnimals(page: $page, hitsPerPage: $hitsPerPage) {
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

async function fetchAllSavedAnimals(page: number): Promise<PageQueryProps> {
  try {
    const { response } = await fetchGraphQL<
      { response: PaginatedResponse<PublicSearchableAnimal> },
      PaginatedRequestParameters
    >(GetAllSavedAnimalsQuery, {
      variables: {
        page,
        // Multiple of 2 and 3 to be nicely displayed.
        hitsPerPage: 18,
      },
    });

    return { type: "success", response };
  } catch (error) {
    captureException(error, {
      extra: { query: "getAllSavedAnimals", page },
    });

    return { type: "error" };
  }
}

export const getServerSideProps: GetServerSideProps<PageQueryProps> = async ({
  query,
  res,
}) => {
  const queryParams = PageQueryParam.fromQuery(query);
  const props = await fetchAllSavedAnimals(queryParams.page);

  if (props.type === "error") {
    res.statusCode = 500;
  }

  return { props };
};

const TITLE = "Animaux sauvés";

const SavedPage: PageComponent<PageQueryProps> = (props) => {
  if (props.type === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} variant="green" />
      <Section>
        <CenteredContent>
          <section>
            <AnimalPaginatedList
              response={props.response}
              renderCard={(animal) => <AnimalCard animal={animal} />}
            />
          </section>
        </CenteredContent>
      </Section>
    </main>
  );
};

SavedPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default SavedPage;

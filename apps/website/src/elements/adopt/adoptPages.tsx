import { AdoptSearchParams } from "core/adoptSearchParams";
import { ANIMAL_AGES_LABELS, ANIMAL_SPECIES_LABELS } from "core/labels";
import { OperationResponse, runOperation } from "core/operations";
import { PageComponent } from "core/pageComponent";
import { PageQueryParam } from "core/pageQueryParam";
import { PageTitle } from "core/pageTitle";
import { SearchFormSection } from "elements/adopt/searchFormSection";
import { SearchResults } from "elements/adopt/searchResults";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { GetServerSideProps } from "next";
import { ErrorPage } from "pages/_error";

type AdoptPage = {
  getServerSideProps: GetServerSideProps<
    OperationResponse<"getAllAdoptableAnimals">
  >;
  AdoptPage: PageComponent<OperationResponse<"getAllAdoptableAnimals">>;
};

export function createAdoptPage(searchParams: AdoptSearchParams): AdoptPage {
  const getServerSideProps: GetServerSideProps<
    OperationResponse<"getAllAdoptableAnimals">
  > = async ({ query, res }) => {
    const queryParams = PageQueryParam.fromQuery(query);

    const getAllAdoptableAnimals = await runOperation({
      name: "getAllAdoptableAnimals",
      params: {
        page: queryParams.page,
        species: searchParams.animalSpecies ?? undefined,
        age: searchParams.animalAge ?? undefined,
      },
    });

    if (getAllAdoptableAnimals.state === "error") {
      res.statusCode = 500;
    }

    return { props: getAllAdoptableAnimals };
  };

  let pageTitle = "À l'adoption";

  if (searchParams.animalSpecies != null) {
    pageTitle = pageTitle.toLowerCase();

    if (searchParams.animalAge != null) {
      pageTitle = [
        ANIMAL_AGES_LABELS[searchParams.animalAge].toLowerCase(),
        pageTitle,
      ].join(" ");
    }

    pageTitle = [
      ANIMAL_SPECIES_LABELS[searchParams.animalSpecies],
      pageTitle,
    ].join(" ");
  }

  const AdoptPage: PageComponent<
    OperationResponse<"getAllAdoptableAnimals">
  > = (props) => {
    if (props.state === "error") {
      return <ErrorPage type="serverError" title={pageTitle} />;
    }

    return (
      <main>
        <PageTitle title={pageTitle} />
        <SearchFormSection searchParams={searchParams} />
        <SearchResults result={props.result} searchParams={searchParams} />
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

import { GetServerSideProps } from "next";
import { OperationResponse, runOperation } from "~/core/operations";
import { PageComponent } from "~/core/pageComponent";
import { PageQueryParam } from "~/core/pageQueryParam";
import { PageTitle } from "~/core/pageTitle";
import { AnimalCard } from "~/dataDisplay/animal/card";
import { AnimalPaginatedList } from "~/dataDisplay/animal/paginatedList";
import { CenteredContent } from "~/layout/centeredContent";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { PageHeader } from "~/layout/pageHeader";
import { Section } from "~/layout/section";
import { ErrorPage } from "~/pages/_error";

export const getServerSideProps: GetServerSideProps<
  OperationResponse<"getAllSavedAnimals">
> = async ({ query, res }) => {
  const queryParams = PageQueryParam.fromQuery(query);

  const getAllSavedAnimals = await runOperation({
    name: "getAllSavedAnimals",
    params: { page: queryParams.page },
  });

  if (getAllSavedAnimals.state === "error") {
    res.statusCode = 500;
  }

  return { props: getAllSavedAnimals };
};

const TITLE = "Animaux sauvés";

const SavedPage: PageComponent<OperationResponse<"getAllSavedAnimals">> = (
  props
) => {
  if (props.state === "error") {
    return <ErrorPage type="serverError" title={TITLE} />;
  }

  return (
    <main>
      <PageTitle title={TITLE} />
      <PageHeader title={TITLE} />
      <Section>
        <CenteredContent>
          <section>
            <AnimalPaginatedList
              result={props.result}
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

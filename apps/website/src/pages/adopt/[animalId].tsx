import { OperationResponse, runOperation } from "core/operations";
import { PageComponent } from "core/pageComponent";
import { PageTitle } from "core/pageTitle";
import { AnimalProfile } from "elements/adopt/animalProfile";
import { Footer } from "layout/footer";
import { Header } from "layout/header";
import { GetServerSideProps } from "next";
import { ErrorPage } from "pages/_error";

export const getServerSideProps: GetServerSideProps<
  OperationResponse<"getAdoptableAnimal">
> = async ({ res, query }) => {
  const animalId = query.animalId as string;

  const getAdoptableAnimal = await runOperation({
    name: "getAdoptableAnimal",
    params: { id: animalId },
  });

  if (getAdoptableAnimal.status === 404) {
    res.statusCode = 404;
    return { notFound: true };
  }

  if (getAdoptableAnimal.state === "error") {
    res.statusCode = 500;
  }

  return { props: getAdoptableAnimal };
};

const AnimalPage: PageComponent<OperationResponse<"getAdoptableAnimal">> = (
  props
) => {
  if (props.state === "error") {
    return <ErrorPage type="serverError" />;
  }

  return (
    <main>
      <PageTitle title={`Adopter ${props.result.displayName}`} />
      <AnimalProfile animal={props.result} />
    </main>
  );
};

AnimalPage.renderLayout = (children) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default AnimalPage;

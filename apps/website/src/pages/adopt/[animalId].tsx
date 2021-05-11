import { PublicAnimal } from "@animeaux/shared-entities/build/animal";
import * as Sentry from "@sentry/react";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import { fetchGraphQL } from "~/core/fetchGraphQL";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { AnimalProfile } from "~/elements/adopt/animalProfile";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
import { NotFoundPage } from "~/pages/404";
import { ErrorPage } from "~/pages/_error";

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
    description
    avatarId
    picturesId
    isOkChildren
    isOkDogs
    isOkCats
    isSterilized
  }
`;

const GetAdoptableAnimalQuery = gql`
  query GetAdoptableAnimal($id: ID!) {
    animal: getAdoptableAnimal(id: $id) {
      ...PublicAnimalFragment
    }
  }

  ${PublicAnimalFragment}
`;

type AnimalPageProps =
  | { animal: PublicAnimal }
  | { hasError: true }
  | { isNotFound: true };

export const getServerSideProps: GetServerSideProps<AnimalPageProps> = async ({
  res,
  query,
}) => {
  const animalId = query.animalId as string;

  try {
    const { animal } = await fetchGraphQL<
      { animal: PublicAnimal | null },
      { id: string }
    >(GetAdoptableAnimalQuery, {
      variables: { id: animalId },
    });

    if (animal == null) {
      res.statusCode = 404;

      return { props: { isNotFound: true } };
    }

    return { props: { animal } };
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        query: "getAdoptableAnimal",
        animalId,
      },
    });

    res.statusCode = 500;

    return { props: { hasError: true } };
  }
};

const AnimalPage: PageComponent<AnimalPageProps> = (props) => {
  if ("hasError" in props) {
    return <ErrorPage type="serverError" />;
  }

  if ("isNotFound" in props) {
    return <NotFoundPage />;
  }

  return (
    <main>
      <PageTitle title={`Adopter ${props.animal.officialName}`} />
      <AnimalProfile animal={props.animal} />
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

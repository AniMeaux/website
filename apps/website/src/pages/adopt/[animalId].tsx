import { PublicAnimal } from "@animeaux/shared-entities/build/animal";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";
import { fetchGraphQL } from "~/core/fetchGraphQL";
import { PageComponent } from "~/core/pageComponent";
import { PageTitle } from "~/core/pageTitle";
import { captureException } from "~/core/sentry";
import { AnimalProfile } from "~/elements/adopt/animalProfile";
import { Footer } from "~/layout/footer";
import { Header } from "~/layout/header";
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
  | { type: "success"; animal: PublicAnimal }
  | { type: "error" };

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
      return { notFound: true };
    }

    return { props: { type: "success", animal } };
  } catch (error) {
    captureException(error, {
      extra: {
        query: "getAdoptableAnimal",
        animalId,
      },
    });

    res.statusCode = 500;

    return { props: { type: "error" } };
  }
};

const AnimalPage: PageComponent<AnimalPageProps> = (props) => {
  if (props.type === "error") {
    return <ErrorPage type="serverError" />;
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

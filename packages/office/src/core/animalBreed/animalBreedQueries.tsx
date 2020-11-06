import {
  AnimalBreed,
  AnimalBreedFormPayload,
  CreateAnimalBreedPayload,
  ErrorCode,
  UpdateAnimalBreedPayload,
} from "@animeaux/shared";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import { fetchGraphQL, useMutation, useQuery, useQueryCache } from "../request";

const AnimalBreedCore = gql`
  fragment AnimalBreedCore on AnimalBreed {
    id
    name
    species
  }
`;

const GetAllAnimalBreedsQuery = gql`
  query GetAllAnimalBreedsQuery {
    animalBreeds: getAllAnimalBreeds {
      ...AnimalBreedCore
    }
  }

  ${AnimalBreedCore}
`;

export function useAllAnimalBreeds() {
  const { data, ...rest } = useQuery<AnimalBreed[], Error>(
    "animal-breeds",
    async () => {
      const { animalBreeds } = await fetchGraphQL<{
        animalBreeds: AnimalBreed[];
      }>(GetAllAnimalBreedsQuery);

      return animalBreeds;
    }
  );

  return [data, rest] as const;
}

const GetAnimalBreedQuery = gql`
  query GetAnimalBreedQuery($id: ID!) {
    animalBreed: getAnimalBreed(id: $id) {
      ...AnimalBreedCore
    }
  }

  ${AnimalBreedCore}
`;

export function useAnimalBreed(animalBreedId: string) {
  const { data, ...rest } = useQuery<AnimalBreed | null, Error>(
    ["animal-breed", animalBreedId],
    async () => {
      const { animalBreed } = await fetchGraphQL<
        { animalBreed: AnimalBreed | null },
        { id: string }
      >(GetAnimalBreedQuery, { variables: { id: animalBreedId } });

      if (animalBreed == null) {
        throw new Error(ErrorCode.ANIMAL_BREED_NOT_FOUND);
      }

      return animalBreed;
    }
  );

  return [data, rest] as const;
}

const CreateAnimalBreedQuery = gql`
  mutation CreateAnimalBreedQuery($name: String!, $species: AnimalSpecies!) {
    animalBreed: createAnimalBreed(name: $name, species: $species) {
      ...AnimalBreedCore
    }
  }

  ${AnimalBreedCore}
`;

export function useCreateAnimalBreed() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<AnimalBreed, Error, AnimalBreedFormPayload>(
    async (payload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.ANIMAL_BREED_MISSING_NAME);
      }

      if (payload.species == null) {
        throw new Error(ErrorCode.ANIMAL_BREED_MISSING_SPECIES);
      }

      const createPayload: CreateAnimalBreedPayload = {
        ...payload,
        // Tells TypeScript `payload.species` cannot be null.
        species: payload.species,
      };

      const { animalBreed } = await fetchGraphQL<
        { animalBreed: AnimalBreed },
        CreateAnimalBreedPayload
      >(CreateAnimalBreedQuery, { variables: createPayload });

      router.push(`/menu/animal-breeds/${animalBreed.id}`);
      return animalBreed;
    },
    {
      onSuccess(animalBreed) {
        queryCache.setQueryData(["animal-breed", animalBreed.id], animalBreed, {
          initialStale: true,
        });

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryCache.invalidateQueries("animal-breeds");
      },
    }
  );
}

const UpdateAnimalBreedQuery = gql`
  mutation UpdateAnimalBreedQuery(
    $id: ID!
    $name: String
    $species: AnimalSpecies
  ) {
    animalBreed: updateAnimalBreed(id: $id, name: $name, species: $species) {
      ...AnimalBreedCore
    }
  }

  ${AnimalBreedCore}
`;

export function useUpdateAnimalBreed() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<
    AnimalBreed,
    Error,
    { currentAnimalBreed: AnimalBreed; formPayload: AnimalBreedFormPayload }
  >(
    async ({ currentAnimalBreed, formPayload }) => {
      const payload: UpdateAnimalBreedPayload = {
        id: currentAnimalBreed.id,
      };

      formPayload.name = formPayload.name.trim();
      if (formPayload.name !== currentAnimalBreed.name) {
        if (formPayload.name === "") {
          throw new Error(ErrorCode.ANIMAL_BREED_MISSING_NAME);
        }

        payload.name = formPayload.name;
      }

      if (
        formPayload.species != null &&
        formPayload.species !== currentAnimalBreed.species
      ) {
        payload.species = formPayload.species;
      }

      const { animalBreed } = await fetchGraphQL<
        { animalBreed: AnimalBreed },
        UpdateAnimalBreedPayload
      >(UpdateAnimalBreedQuery, { variables: payload });

      router.push(`/menu/animal-breeds/${animalBreed.id}`);
      return animalBreed;
    },
    {
      onSuccess(animalBreed) {
        queryCache.setQueryData(["animal-breed", animalBreed.id], animalBreed, {
          initialStale: true,
        });

        queryCache.setQueryData<AnimalBreed[]>(
          "animal-breeds",
          (animalBreeds) =>
            (animalBreeds ?? []).map((b) =>
              b.id === animalBreed.id ? animalBreed : b
            ),
          { initialStale: true }
        );
      },
    }
  );
}

const DeleteAnimalBreedQuery = gql`
  mutation DeleteAnimalBreedQuery($id: ID!) {
    deleteAnimalBreed(id: $id)
  }
`;

export function useDeleteAnimalBreed() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<string, Error, string>(
    async (animalBreedId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteAnimalBreedQuery, {
        variables: { id: animalBreedId },
      });

      router.push("/menu/animal-breeds");
      return animalBreedId;
    },
    {
      onSuccess(animalBreedId) {
        queryCache.removeQueries(["animal-breed", animalBreedId]);

        queryCache.setQueryData<AnimalBreed[]>(
          "animal-breeds",
          (animalBreeds) =>
            (animalBreeds ?? []).filter(
              (animalBreed) => animalBreed.id !== animalBreedId
            ),
          { initialStale: true }
        );
      },
    }
  );
}

import {
  AnimalBreed,
  AnimalBreedFilters,
  AnimalBreedFormPayload,
  CreateAnimalBreedPayload,
  ErrorCode,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
} from "@animeaux/shared-entities";
import { gql } from "graphql-request";
import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { fetchGraphQL, useMutation, useQuery, useQueryCache } from "../request";

const AnimalBreedCore = gql`
  fragment AnimalBreedCore on AnimalBreed {
    id
    name
    species
  }
`;

const GetAllAnimalBreedsQuery = gql`
  query GetAllAnimalBreedsQuery(
    $search: String
    $page: Int
    $species: AnimalSpecies
  ) {
    response: getAllAnimalBreeds(
      search: $search
      page: $page
      species: $species
    ) {
      hits {
        ...AnimalBreedCore
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${AnimalBreedCore}
`;

export function useAllAnimalBreeds({
  search,
  species,
}: AnimalBreedFilters = {}) {
  const { data, refetch, ...rest } = useInfiniteQuery<
    PaginatedResponse<AnimalBreed>,
    Error
  >(
    "animal-breeds",
    async (key: string, page: number = 0) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<AnimalBreed> },
        AnimalBreedFilters
      >(GetAllAnimalBreedsQuery, {
        variables: { search, species, page },
      });

      return response;
    },
    {
      // Return the next page that will be passed as last parameter of the
      // fetch function.
      getFetchMore(lastGroup) {
        if (lastGroup.page < lastGroup.pageCount - 1) {
          return lastGroup.page + 1;
        }
      },
    }
  );

  // We don't add filters to the key to avoid polluting the cache and all the
  // loading states.
  React.useEffect(() => {
    refetch();
  }, [search, species, refetch]);

  return [data, { ...rest, refetch }] as const;
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

export function useCreateAnimalBreed(
  onSuccess?: (animalBreed: AnimalBreed) => void
) {
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

        if (onSuccess != null) {
          onSuccess(animalBreed);
        }
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

export function useUpdateAnimalBreed(
  onSuccess?: (animalBreed: AnimalBreed) => void
) {
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

      return animalBreed;
    },
    {
      onSuccess(animalBreed) {
        queryCache.setQueryData(["animal-breed", animalBreed.id], animalBreed, {
          initialStale: true,
        });

        queryCache.setQueryData<PaginatedResponse<AnimalBreed>[]>(
          "animal-breeds",
          (animalBreedsPages) =>
            (animalBreedsPages ?? []).map((page) => ({
              ...page,
              hits: page.hits.map((a) =>
                a.id === animalBreed.id ? animalBreed : a
              ),
            })),
          { initialStale: true }
        );

        if (onSuccess != null) {
          onSuccess(animalBreed);
        }
      },
    }
  );
}

const DeleteAnimalBreedQuery = gql`
  mutation DeleteAnimalBreedQuery($id: ID!) {
    deleteAnimalBreed(id: $id)
  }
`;

export function useDeleteAnimalBreed(
  onSuccess?: (animalBreedId: string) => void
) {
  const queryCache = useQueryCache();

  return useMutation<string, Error, string>(
    async (animalBreedId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteAnimalBreedQuery, {
        variables: { id: animalBreedId },
      });

      return animalBreedId;
    },
    {
      onSuccess(animalBreedId) {
        queryCache.removeQueries(["animal-breed", animalBreedId]);

        queryCache.setQueryData<PaginatedResponse<AnimalBreed>[]>(
          "animal-breeds",
          (animalBreedsPages) =>
            (animalBreedsPages ?? []).map((page) => ({
              ...page,
              hits: page.hits.filter((a) => a.id !== animalBreedId),
            })),
          { initialStale: true }
        );

        if (onSuccess != null) {
          onSuccess(animalBreedId);
        }
      },
    }
  );
}

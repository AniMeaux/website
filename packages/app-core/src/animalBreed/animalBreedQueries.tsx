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
import {
  fetchGraphQL,
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "../request";

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
  const isInitialRender = React.useRef(true);

  const { data, refetch, ...rest } = useInfiniteQuery<
    PaginatedResponse<AnimalBreed>,
    Error
  >(
    "animal-breeds",
    async ({ pageParam = 0 }) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<AnimalBreed> },
        AnimalBreedFilters
      >(GetAllAnimalBreedsQuery, {
        variables: { search, species, page: pageParam },
      });

      return response;
    },
    {
      // Return the next page that will be passed as `pageParam` to the fetch
      // function.
      getNextPageParam(lastGroup) {
        if (lastGroup.page < lastGroup.pageCount - 1) {
          return lastGroup.page + 1;
        }
      },
    }
  );

  // We don't add filters to the key to avoid polluting the cache and all the
  // loading states.
  React.useEffect(() => {
    // We don't want to refetch after the inital render because
    // `useInfiniteQuery` already does it.
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      refetch();
    }
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
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    AnimalBreed,
    Error,
    AnimalBreedFormPayload
  >(
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
        queryClient.setQueryData(["animal-breed", animalBreed.id], animalBreed);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("animal-breeds");

        if (onSuccess != null) {
          onSuccess(animalBreed);
        }
      },
    }
  );

  return [mutate, rest] as const;
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
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
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
        queryClient.setQueryData(["animal-breed", animalBreed.id], animalBreed);

        queryClient.setQueryData<InfiniteData<
          PaginatedResponse<AnimalBreed>
        > | null>("animal-breeds", (animalBreedsPages) => {
          if (animalBreedsPages == null) {
            return null;
          }

          return {
            ...animalBreedsPages,
            pages: animalBreedsPages.pages.map((page) => ({
              ...page,
              hits: page.hits.map((a) =>
                a.id === animalBreed.id ? animalBreed : a
              ),
            })),
          };
        });

        if (onSuccess != null) {
          onSuccess(animalBreed);
        }
      },
    }
  );

  return [mutate, rest] as const;
}

const DeleteAnimalBreedQuery = gql`
  mutation DeleteAnimalBreedQuery($id: ID!) {
    deleteAnimalBreed(id: $id)
  }
`;

export function useDeleteAnimalBreed(
  onSuccess?: (animalBreedId: string) => void
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<string, Error, string>(
    async (animalBreedId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteAnimalBreedQuery, {
        variables: { id: animalBreedId },
      });

      return animalBreedId;
    },
    {
      onSuccess(animalBreedId) {
        queryClient.removeQueries(["animal-breed", animalBreedId]);

        queryClient.setQueryData<InfiniteData<
          PaginatedResponse<AnimalBreed>
        > | null>("animal-breeds", (animalBreedsPages) => {
          if (animalBreedsPages == null) {
            return null;
          }

          return {
            ...animalBreedsPages,
            pages: animalBreedsPages.pages.map((page) => ({
              ...page,
              hits: page.hits.filter((a) => a.id !== animalBreedId),
            })),
          };
        });

        if (onSuccess != null) {
          onSuccess(animalBreedId);
        }
      },
    }
  );

  return [mutate, rest] as const;
}

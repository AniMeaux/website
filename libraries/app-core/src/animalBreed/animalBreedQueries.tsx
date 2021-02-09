import {
  AnimalBreed,
  AnimalBreedFilters,
  AnimalBreedFormPayload,
  CreateAnimalBreedPayload,
  ErrorCode,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
} from "@animeaux/shared-entities";
import { showSnackbar, Snackbar } from "@animeaux/ui-library";
import { gql } from "graphql-request";
import * as React from "react";
import {
  fetchGraphQL,
  removeDataFromInfiniteCache,
  updateDataInInfiniteCache,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
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
  return useInfiniteQuery<PaginatedResponse<AnimalBreed>, Error>(
    ["animal-breeds", search, species],
    async ({ pageParam = 0 }) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<AnimalBreed> },
        AnimalBreedFilters
      >(GetAllAnimalBreedsQuery, {
        variables: { search, species, page: pageParam },
      });

      return response;
    }
  );
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
  options?: UseMutationOptions<AnimalBreed, Error, AnimalBreedFormPayload>
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
      ...options,

      errorCodesToIgnore: [
        ErrorCode.ANIMAL_BREED_MISSING_NAME,
        ErrorCode.ANIMAL_BREED_MISSING_SPECIES,
      ],

      onSuccess(animalBreed, ...rest) {
        queryClient.setQueryData(["animal-breed", animalBreed.id], animalBreed);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("animal-breeds");

        showSnackbar.success(<Snackbar type="success">Race créée</Snackbar>);

        options?.onSuccess?.(animalBreed, ...rest);
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
  options?: UseMutationOptions<
    AnimalBreed,
    Error,
    { currentAnimalBreed: AnimalBreed; formPayload: AnimalBreedFormPayload }
  >
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
      ...options,

      errorCodesToIgnore: [
        ErrorCode.ANIMAL_BREED_MISSING_NAME,
        ErrorCode.ANIMAL_BREED_MISSING_SPECIES,
      ],

      onSuccess(animalBreed, ...rest) {
        queryClient.setQueryData(["animal-breed", animalBreed.id], animalBreed);

        queryClient.setQueryData(
          "animal-breeds",
          updateDataInInfiniteCache(animalBreed)
        );

        showSnackbar.success(<Snackbar type="success">Race modifiée</Snackbar>);

        options?.onSuccess?.(animalBreed, ...rest);
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
  options?: UseMutationOptions<string, Error, string>
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
      ...options,

      onSuccess(animalBreedId, ...rest) {
        queryClient.removeQueries(["animal-breed", animalBreedId]);

        queryClient.setQueryData(
          "animal-breeds",
          removeDataFromInfiniteCache(animalBreedId)
        );

        // Invalidate it to make sure pagination is up to date.
        queryClient.invalidateQueries("animal-breeds");

        showSnackbar.success(
          <Snackbar type="success">Race supprimée</Snackbar>
        );

        options?.onSuccess?.(animalBreedId, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

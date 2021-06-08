import {
  AnimalColor,
  AnimalColorFormPayload,
  AnimalColorSearch,
  CreateAnimalColorPayload,
  ErrorCode,
  PaginatedRequestParameters,
  PaginatedResponse,
  UpdateAnimalColorPayload,
} from "@animeaux/shared-entities";
import {
  fetchGraphQL,
  removeDataFromInfiniteCache,
  setQueriesData,
  updateDataInInfiniteCache,
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "core/request";
import { gql } from "graphql-request";
import { showSnackbar, Snackbar } from "popovers/snackbar";
import * as React from "react";

export const AnimalColorFragment = gql`
  fragment AnimalColorFragment on AnimalColor {
    id
    name
  }
`;

const GetAllAnimalColorsQuery = gql`
  query GetAllAnimalColorsQuery($search: String, $page: Int) {
    response: getAllAnimalColors(search: $search, page: $page) {
      hits {
        ...AnimalColorFragment
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${AnimalColorFragment}
`;

export function useAllAnimalColors(animalColorSearch: AnimalColorSearch = {}) {
  const queryClient = useQueryClient();

  return useInfiniteQuery<PaginatedResponse<AnimalColor>, Error>(
    ["animal-colors", animalColorSearch],
    async ({ pageParam = 0 }) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<AnimalColor> },
        PaginatedRequestParameters<AnimalColorSearch>
      >(GetAllAnimalColorsQuery, {
        variables: { page: pageParam, ...animalColorSearch },
      });

      return response;
    },
    {
      onSuccess(data) {
        // As the objects are the same for the list and the details, we set all
        // values in the cache to avoid waiting for data we already have.
        data.pages.forEach((page) => {
          page.hits.forEach((animalcolor) => {
            queryClient.setQueryData(
              ["animal-color", animalcolor.id],
              animalcolor
            );
          });
        });
      },
    }
  );
}

const GetAnimalColorQuery = gql`
  query GetAnimalColorQuery($id: ID!) {
    animalColor: getAnimalColor(id: $id) {
      ...AnimalColorFragment
    }
  }

  ${AnimalColorFragment}
`;

export function useAnimalColor(animalColorId: string) {
  return useQuery<AnimalColor | null, Error>(
    ["animal-color", animalColorId],
    async () => {
      const { animalColor } = await fetchGraphQL<
        { animalColor: AnimalColor | null },
        { id: string }
      >(GetAnimalColorQuery, { variables: { id: animalColorId } });

      if (animalColor == null) {
        throw new Error(ErrorCode.ANIMAL_COLOR_NOT_FOUND);
      }

      return animalColor;
    }
  );
}

const CreateAnimalColorQuery = gql`
  mutation CreateAnimalColorQuery($name: String!) {
    animalColor: createAnimalColor(name: $name) {
      ...AnimalColorFragment
    }
  }

  ${AnimalColorFragment}
`;

export function useCreateAnimalColor(
  options?: UseMutationOptions<AnimalColor, Error, AnimalColorFormPayload>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    AnimalColor,
    Error,
    AnimalColorFormPayload
  >(
    async (payload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.ANIMAL_COLOR_MISSING_NAME);
      }

      const createPayload: CreateAnimalColorPayload = {
        ...payload,
      };

      const { animalColor } = await fetchGraphQL<
        { animalColor: AnimalColor },
        CreateAnimalColorPayload
      >(CreateAnimalColorQuery, { variables: createPayload });

      return animalColor;
    },
    {
      ...options,

      errorCodesToIgnore: [ErrorCode.ANIMAL_COLOR_MISSING_NAME],

      onSuccess(animalColor, ...rest) {
        queryClient.setQueryData(["animal-color", animalColor.id], animalColor);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("animal-colors");

        showSnackbar.success(<Snackbar>Couleur créée</Snackbar>);

        options?.onSuccess?.(animalColor, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const UpdateAnimalColorQuery = gql`
  mutation UpdateAnimalColorQuery($id: ID!, $name: String) {
    animalColor: updateAnimalColor(id: $id, name: $name) {
      ...AnimalColorFragment
    }
  }

  ${AnimalColorFragment}
`;

export function useUpdateAnimalColor(
  options?: UseMutationOptions<
    AnimalColor,
    Error,
    { currentAnimalColor: AnimalColor; formPayload: AnimalColorFormPayload }
  >
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    AnimalColor,
    Error,
    { currentAnimalColor: AnimalColor; formPayload: AnimalColorFormPayload }
  >(
    async ({ currentAnimalColor, formPayload }) => {
      const payload: UpdateAnimalColorPayload = {
        id: currentAnimalColor.id,
      };

      formPayload.name = formPayload.name.trim();
      if (formPayload.name !== currentAnimalColor.name) {
        if (formPayload.name === "") {
          throw new Error(ErrorCode.ANIMAL_COLOR_MISSING_NAME);
        }

        payload.name = formPayload.name;
      }

      const { animalColor } = await fetchGraphQL<
        { animalColor: AnimalColor },
        UpdateAnimalColorPayload
      >(UpdateAnimalColorQuery, { variables: payload });

      return animalColor;
    },
    {
      ...options,

      errorCodesToIgnore: [ErrorCode.ANIMAL_COLOR_MISSING_NAME],

      onSuccess(animalColor, ...rest) {
        queryClient.setQueryData(["animal-color", animalColor.id], animalColor);

        setQueriesData(
          queryClient,
          "animal-colors",
          updateDataInInfiniteCache(animalColor)
        );

        showSnackbar.success(<Snackbar>Couleur modifiée</Snackbar>);

        options?.onSuccess?.(animalColor, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const DeleteAnimalColorQuery = gql`
  mutation DeleteAnimalColorQuery($id: ID!) {
    deleteAnimalColor(id: $id)
  }
`;

export function useDeleteAnimalColor(
  options?: UseMutationOptions<string, Error, string>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<string, Error, string>(
    async (animalColorId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteAnimalColorQuery, {
        variables: { id: animalColorId },
      });

      return animalColorId;
    },
    {
      ...options,

      onSuccess(animalColorId, ...rest) {
        queryClient.removeQueries(["animal-color", animalColorId]);

        setQueriesData(
          queryClient,
          "animal-colors",
          removeDataFromInfiniteCache(animalColorId)
        );

        showSnackbar.success(<Snackbar>Couleur supprimée</Snackbar>);

        options?.onSuccess?.(animalColorId, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

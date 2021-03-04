import {
  Animal,
  AnimalFormPayload,
  AnimalPicturesFormPayload,
  AnimalProfileFormPayload,
  AnimalSituationFormPayload,
  createAminalCreationApiPayload,
  createAminalPicturesUpdateApiPayload,
  createAminalProfileUpdateApiPayload,
  createAminalSituationUpdateApiPayload,
  CreateAnimalPayload,
  createAnimalProfileCreationApiPayload,
  createAnimalSituationCreationApiPayload,
  ErrorCode,
  getImageId,
  ImageFile,
  isImageFile,
  PaginatedRequest,
  PaginatedResponse,
  SearchableAnimal,
  SearchFilter,
  UpdateAnimalPayload,
} from "@animeaux/shared-entities";
import { showSnackbar, Snackbar, useImageProvider } from "@animeaux/ui-library";
import { gql } from "graphql-request";
import * as React from "react";
import { useInfiniteQuery } from "react-query";
import difference from "lodash.difference";
import { AnimalBreedFragment } from "../animalBreed/animalBreedQueries";
import { deleteImage, uploadImageFile, useCloudinary } from "../cloudinary";
import { HostFamilyFragment } from "../hostFamily/hostFamilyQueries";
import {
  fetchGraphQL,
  removeDataFromInfiniteCache,
  updateDataInInfiniteCache,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "../request";

const SearchableAnimalFragment = gql`
  fragment SearchableAnimalFragment on SearchableAnimal {
    id
    officialName
    commonName
    birthdate
    pickUpDate
    gender
    species
    breed {
      ...AnimalBreedFragment
    }
    color
    status
    avatarId
    isOkChildren
    isOkDogs
    isOkCats
    isSterilized
  }

  ${AnimalBreedFragment}
`;

const AnimalFragment = gql`
  fragment AnimalFragment on Animal {
    id
    officialName
    commonName
    birthdate
    pickUpDate
    gender
    species
    breed {
      ...AnimalBreedFragment
    }
    color
    status
    avatarId
    picturesId
    hostFamily {
      ...HostFamilyFragment
    }
    isOkChildren
    isOkDogs
    isOkCats
    isSterilized
  }

  ${AnimalBreedFragment}
  ${HostFamilyFragment}
`;

const GetAllAnimalsQuery = gql`
  query GetAllAnimalsQuery($search: String, $page: Int) {
    response: getAllAnimals(search: $search, page: $page) {
      hits {
        ...SearchableAnimalFragment
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${SearchableAnimalFragment}
`;

export function useAllAnimals({ search }: SearchFilter = {}) {
  return useInfiniteQuery<PaginatedResponse<SearchableAnimal>, Error>(
    ["animals", search],
    async ({ pageParam = 0 }) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<SearchableAnimal> },
        PaginatedRequest
      >(GetAllAnimalsQuery, {
        variables: { search, page: pageParam },
      });

      return response;
    }
  );
}

export function useCreateAnimalProfile(
  options?: UseMutationOptions<void, Error, AnimalProfileFormPayload>
) {
  const { mutate, ...rest } = useMutation<
    void,
    Error,
    AnimalProfileFormPayload
  >(
    async (payload) => {
      createAnimalProfileCreationApiPayload(payload);
    },
    {
      ...options,
      errorCodesToIgnore: [
        ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME,
        ErrorCode.ANIMAL_INVALID_BIRTHDATE,
        ErrorCode.ANIMAL_MISSING_GENDER,
        ErrorCode.ANIMAL_MISSING_SPECIES,
        ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH,
      ],
      onSuccess(profilePayload, ...rest) {
        options?.onSuccess?.(profilePayload, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

export function useCreateAnimalSituation(
  options?: UseMutationOptions<void, Error, AnimalSituationFormPayload>
) {
  const { mutate, ...rest } = useMutation<
    void,
    Error,
    AnimalSituationFormPayload
  >(
    async (payload) => {
      createAnimalSituationCreationApiPayload(payload);
    },
    {
      ...options,
      errorCodesToIgnore: [ErrorCode.ANIMAL_INVALID_PICK_UP_DATE],
      onSuccess(situationPayload, ...rest) {
        options?.onSuccess?.(situationPayload, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const CreateAnimalQuery = gql`
  mutation CreateAnimalQuery(
    $officialName: String!
    $commonName: String
    $birthdate: String!
    $pickUpDate: String!
    $gender: AnimalGender!
    $species: AnimalSpecies!
    $breedId: ID
    $color: AnimalColor
    $status: AnimalStatus!
    $avatarId: String!
    $picturesId: [String!]!
    $hostFamilyId: ID
    $isOkChildren: Trilean!
    $isOkDogs: Trilean!
    $isOkCats: Trilean!
    $isSterilized: Boolean!
  ) {
    animal: createAnimal(
      officialName: $officialName
      commonName: $commonName
      birthdate: $birthdate
      pickUpDate: $pickUpDate
      gender: $gender
      species: $species
      breedId: $breedId
      color: $color
      status: $status
      avatarId: $avatarId
      picturesId: $picturesId
      hostFamilyId: $hostFamilyId
      isOkChildren: $isOkChildren
      isOkDogs: $isOkDogs
      isOkCats: $isOkCats
      isSterilized: $isSterilized
    ) {
      ...AnimalFragment
    }
  }

  ${AnimalFragment}
`;

export function useCreateAnimal(
  options?: UseMutationOptions<Animal, Error, AnimalFormPayload>
) {
  const queryClient = useQueryClient();
  const { imageProvider } = useCloudinary();

  const { mutate, ...rest } = useMutation<Animal, Error, AnimalFormPayload>(
    async (formPayload) => {
      // Do this first as it checks the form payload.
      const createPayload = createAminalCreationApiPayload(formPayload);

      await Promise.all(
        formPayload.pictures.map((picture) =>
          uploadImageFile(
            imageProvider,
            // It can only be an `ImageFile` when creating a new animal.
            picture as ImageFile,
            { tags: ["animal"] }
          )
        )
      );

      const { animal } = await fetchGraphQL<
        { animal: Animal },
        CreateAnimalPayload
      >(CreateAnimalQuery, { variables: createPayload });

      return animal;
    },
    {
      ...options,
      errorCodesToIgnore: [
        ErrorCode.ANIMAL_MISSING_SPECIES,
        ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME,
        ErrorCode.ANIMAL_INVALID_BIRTHDATE,
        ErrorCode.ANIMAL_MISSING_GENDER,
        ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH,
        ErrorCode.ANIMAL_INVALID_PICK_UP_DATE,
        ErrorCode.ANIMAL_MISSING_AVATAR,
      ],

      onSuccess(animal, ...rest) {
        queryClient.setQueryData(["animal", animal.id], animal);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("animals");

        showSnackbar.success(<Snackbar type="success">Animal créée</Snackbar>);

        options?.onSuccess?.(animal, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const GetAnimalQuery = gql`
  query GetAnimalQuery($id: ID!) {
    animal: getAnimal(id: $id) {
      ...AnimalFragment
    }
  }

  ${AnimalFragment}
`;

export function useAnimal(animalId: string) {
  return useQuery<Animal | null, Error>(["animal", animalId], async () => {
    const { animal } = await fetchGraphQL<
      { animal: Animal | null },
      { id: string }
    >(GetAnimalQuery, { variables: { id: animalId } });

    if (animal == null) {
      throw new Error(ErrorCode.ANIMAL_NOT_FOUND);
    }

    return animal;
  });
}

const DeleteAnimalQuery = gql`
  mutation DeleteAnimalQuery($id: ID!) {
    deleteAnimal(id: $id)
  }
`;

export function useDeleteAnimal(
  options?: UseMutationOptions<Animal, Error, Animal>
) {
  const queryClient = useQueryClient();
  const { imageProvider } = useCloudinary();

  const { mutate, ...rest } = useMutation<Animal, Error, Animal>(
    async (animal) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteAnimalQuery, {
        variables: { id: animal.id },
      });

      await Promise.all(
        [animal.avatarId]
          .concat(animal.picturesId)
          .map((pictureId) => deleteImage(imageProvider, pictureId))
      );
      return animal;
    },
    {
      ...options,

      onSuccess(animal, ...rest) {
        queryClient.removeQueries(["animal", animal.id]);

        queryClient.setQueryData(
          "animals",
          removeDataFromInfiniteCache(animal.id)
        );

        // Invalidate it to make sure pagination is up to date.
        queryClient.invalidateQueries("animals");

        showSnackbar.success(
          <Snackbar type="success">Animal supprimée</Snackbar>
        );

        options?.onSuccess?.(animal, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const UpdateAnimalQuery = gql`
  mutation UpdateAnimalQuery(
    $id: ID!
    $officialName: String
    $commonName: String
    $birthdate: String
    $pickUpDate: String
    $gender: AnimalGender
    $species: AnimalSpecies
    $breedId: ID
    $color: AnimalColor
    $status: AnimalStatus
    $avatarId: String
    $picturesId: [String!]
    $hostFamilyId: ID
    $isOkChildren: Trilean
    $isOkDogs: Trilean
    $isOkCats: Trilean
    $isSterilized: Boolean
  ) {
    animal: updateAnimal(
      id: $id
      officialName: $officialName
      commonName: $commonName
      birthdate: $birthdate
      pickUpDate: $pickUpDate
      gender: $gender
      species: $species
      breedId: $breedId
      color: $color
      status: $status
      avatarId: $avatarId
      picturesId: $picturesId
      hostFamilyId: $hostFamilyId
      isOkChildren: $isOkChildren
      isOkDogs: $isOkDogs
      isOkCats: $isOkCats
      isSterilized: $isSterilized
    ) {
      ...AnimalFragment
    }
  }

  ${AnimalFragment}
`;

export function useUpdateAnimalProfile(
  options?: UseMutationOptions<
    Animal,
    Error,
    { currentAnimal: Animal; formPayload: AnimalProfileFormPayload }
  >
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    Animal,
    Error,
    { currentAnimal: Animal; formPayload: AnimalProfileFormPayload }
  >(
    async ({ currentAnimal, formPayload }) => {
      const updatePayload = createAminalProfileUpdateApiPayload(
        currentAnimal,
        formPayload
      );

      const { animal } = await fetchGraphQL<
        { animal: Animal },
        UpdateAnimalPayload
      >(UpdateAnimalQuery, { variables: updatePayload });

      return animal;
    },
    {
      ...options,
      errorCodesToIgnore: [
        ErrorCode.ANIMAL_MISSING_SPECIES,
        ErrorCode.ANIMAL_MISSING_OFFICIAL_NAME,
        ErrorCode.ANIMAL_INVALID_BIRTHDATE,
        ErrorCode.ANIMAL_MISSING_GENDER,
        ErrorCode.ANIMAL_SPECIES_BREED_MISSMATCH,
      ],

      onSuccess(animal, ...rest) {
        queryClient.setQueryData(["animal", animal.id], animal);

        queryClient.setQueryData("animals", updateDataInInfiniteCache(animal));

        showSnackbar.success(
          <Snackbar type="success">Animal modifiée</Snackbar>
        );

        options?.onSuccess?.(animal, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

export function useUpdateAnimalSituation(
  options?: UseMutationOptions<
    Animal,
    Error,
    { currentAnimal: Animal; formPayload: AnimalSituationFormPayload }
  >
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    Animal,
    Error,
    { currentAnimal: Animal; formPayload: AnimalSituationFormPayload }
  >(
    async ({ currentAnimal, formPayload }) => {
      const updatePayload = createAminalSituationUpdateApiPayload(
        currentAnimal,
        formPayload
      );

      const { animal } = await fetchGraphQL<
        { animal: Animal },
        UpdateAnimalPayload
      >(UpdateAnimalQuery, { variables: updatePayload });

      return animal;
    },
    {
      ...options,
      errorCodesToIgnore: [ErrorCode.ANIMAL_INVALID_PICK_UP_DATE],

      onSuccess(animal, ...rest) {
        queryClient.setQueryData(["animal", animal.id], animal);

        queryClient.setQueryData("animals", updateDataInInfiniteCache(animal));

        showSnackbar.success(
          <Snackbar type="success">Animal modifiée</Snackbar>
        );

        options?.onSuccess?.(animal, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

export function useUpdateAnimalPicture(
  options?: UseMutationOptions<
    Animal,
    Error,
    { currentAnimal: Animal; formPayload: AnimalPicturesFormPayload }
  >
) {
  const queryClient = useQueryClient();
  const { imageProvider } = useImageProvider();

  const { mutate, ...rest } = useMutation<
    Animal,
    Error,
    { currentAnimal: Animal; formPayload: AnimalPicturesFormPayload }
  >(
    async ({ currentAnimal, formPayload }) => {
      const updatePayload = createAminalPicturesUpdateApiPayload(
        currentAnimal,
        formPayload
      );

      const picturesToUpload = formPayload.pictures.filter(isImageFile);
      if (picturesToUpload.length > 0) {
        await Promise.all(
          picturesToUpload.map((picture) =>
            uploadImageFile(imageProvider, picture, { tags: ["animal"] })
          )
        );
      }

      const { animal } = await fetchGraphQL<
        { animal: Animal },
        UpdateAnimalPayload
      >(UpdateAnimalQuery, { variables: updatePayload });

      const picturesToDelete = difference(
        [currentAnimal.avatarId].concat(currentAnimal.picturesId),
        formPayload.pictures.map(getImageId)
      );

      // Only remove images if the animal was successfully updated.
      if (picturesToDelete.length > 0) {
        await Promise.all(
          picturesToDelete.map((pictureId) =>
            deleteImage(imageProvider, pictureId)
          )
        );
      }

      return animal;
    },
    {
      ...options,
      errorCodesToIgnore: [ErrorCode.ANIMAL_MISSING_AVATAR],

      onSuccess(animal, ...rest) {
        queryClient.setQueryData(["animal", animal.id], animal);

        queryClient.setQueryData("animals", updateDataInInfiniteCache(animal));

        showSnackbar.success(
          <Snackbar type="success">Animal modifiée</Snackbar>
        );

        options?.onSuccess?.(animal, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

import {
  CreateHostFamilyPayload,
  EMAIL_PATTERN,
  ErrorCode,
  HostFamily,
  HostFamilyFilters,
  HostFamilyFormPayload,
  PaginatedResponse,
  SearchableHostFamily,
  toSearchableHostFamily,
  UpdateHostFamilyPayload,
} from "@animeaux/shared-entities";
import { showSnackbar, Snackbar } from "@animeaux/ui-library";
import { gql } from "graphql-request";
import isEqual from "lodash.isequal";
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

const SearchableHostFamilyFragment = gql`
  fragment SearchableHostFamilyFragment on SearchableHostFamily {
    id
    name
    phone
    email
    address
    housing
    hasChild
    hasGarden
    hasVehicle
  }
`;

const HostFamilyDetailsFragment = gql`
  fragment HostFamilyDetailsFragment on HostFamily {
    id
    name
    phone
    email
    address
    housing
    hasChild
    hasGarden
    hasVehicle
    linkToDrive
    linkToFacebook
    ownAnimals
  }
`;

const GetAllHostFamiliesQuery = gql`
  query GetAllHostFamiliesQuery(
    $search: String
    $page: Int
    $housing: HousingType
    $hasChild: Boolean
    $hasGarden: Boolean
    $hasVehicle: Trilean
  ) {
    response: getAllHostFamilies(
      search: $search
      page: $page
      housing: $housing
      hasChild: $hasChild
      hasGarden: $hasGarden
      hasVehicle: $hasVehicle
    ) {
      hits {
        ...SearchableHostFamilyFragment
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${SearchableHostFamilyFragment}
`;

export function useAllHostFamilies({
  search,
  hasChild,
  hasGarden,
  hasVehicle,
  housing,
}: HostFamilyFilters = {}) {
  const { data, ...rest } = useInfiniteQuery<
    PaginatedResponse<SearchableHostFamily>,
    Error
  >(
    ["host-families", search, hasChild, hasGarden, hasVehicle, housing],
    async ({ pageParam = 0 }) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<SearchableHostFamily> },
        HostFamilyFilters
      >(GetAllHostFamiliesQuery, {
        variables: {
          page: pageParam,
          search,
          hasChild,
          hasGarden,
          hasVehicle,
          housing,
        },
      });

      return response;
    }
  );

  return [data, rest] as const;
}

const GetHostFamilyQuery = gql`
  query GetHostFamilyQuery($id: ID!) {
    hostFamily: getHostFamily(id: $id) {
      ...HostFamilyDetailsFragment
    }
  }

  ${HostFamilyDetailsFragment}
`;

export function useHostFamily(hostFamilyId: string) {
  const { data, ...rest } = useQuery<HostFamily | null, Error>(
    ["host-family", hostFamilyId],
    async () => {
      const { hostFamily } = await fetchGraphQL<
        { hostFamily: HostFamily | null },
        { id: string }
      >(GetHostFamilyQuery, { variables: { id: hostFamilyId } });

      if (hostFamily == null) {
        throw new Error(ErrorCode.HOST_FAMILY_NOT_FOUND);
      }

      return hostFamily;
    }
  );

  return [data, rest] as const;
}

const CreateHostFamilyQuery = gql`
  mutation CreateHostFamilyQuery(
    $name: String!
    $phone: String!
    $email: String!
    $address: String!
    $housing: HousingType!
    $hasChild: Boolean!
    $hasGarden: Boolean!
    $hasVehicle: Trilean!
    $linkToDrive: String
    $linkToFacebook: String
    $ownAnimals: JSONObject!
  ) {
    hostFamily: createHostFamily(
      name: $name
      phone: $phone
      email: $email
      address: $address
      housing: $housing
      hasChild: $hasChild
      hasGarden: $hasGarden
      hasVehicle: $hasVehicle
      linkToDrive: $linkToDrive
      linkToFacebook: $linkToFacebook
      ownAnimals: $ownAnimals
    ) {
      ...HostFamilyDetailsFragment
    }
  }

  ${HostFamilyDetailsFragment}
`;

export function useCreateHostFamily(
  options?: UseMutationOptions<HostFamily, Error, HostFamilyFormPayload>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    HostFamily,
    Error,
    HostFamilyFormPayload
  >(
    async (payload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_NAME);
      }

      if (payload.phone.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_PHONE);
      }

      if (!EMAIL_PATTERN.test(payload.email.trim())) {
        throw new Error(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
      }

      if (payload.address.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
      }

      if (payload.housing == null) {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_HOUSING);
      }

      const createPayload: CreateHostFamilyPayload = {
        ...payload,
        // Tells TypeScript `payload.housing` cannot be null.
        housing: payload.housing,
      };

      const { hostFamily } = await fetchGraphQL<
        { hostFamily: HostFamily },
        CreateHostFamilyPayload
      >(CreateHostFamilyQuery, { variables: createPayload });

      return hostFamily;
    },
    {
      ...options,

      errorCodesToIgnore: [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
        ErrorCode.HOST_FAMILY_MISSING_PHONE,
        ErrorCode.HOST_FAMILY_INVALID_EMAIL,
        ErrorCode.HOST_FAMILY_MISSING_ADDRESS,
        ErrorCode.HOST_FAMILY_MISSING_HOUSING,
      ],

      onSuccess(hostFamily, ...rest) {
        queryClient.setQueryData(["host-family", hostFamily.id], hostFamily);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("host-families");

        showSnackbar.success(<Snackbar type="success">FA créée</Snackbar>);

        options?.onSuccess?.(hostFamily, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const UpdateHostFamilyQuery = gql`
  mutation UpdateHostFamilyQuery(
    $id: ID!
    $name: String
    $phone: String
    $email: String
    $address: String
    $housing: HousingType
    $hasChild: Boolean
    $hasGarden: Boolean
    $hasVehicle: Trilean
    $linkToDrive: String
    $linkToFacebook: String
    $ownAnimals: JSONObject
  ) {
    hostFamily: updateHostFamily(
      id: $id
      name: $name
      phone: $phone
      email: $email
      address: $address
      housing: $housing
      hasChild: $hasChild
      hasGarden: $hasGarden
      hasVehicle: $hasVehicle
      linkToDrive: $linkToDrive
      linkToFacebook: $linkToFacebook
      ownAnimals: $ownAnimals
    ) {
      ...HostFamilyDetailsFragment
    }
  }

  ${HostFamilyDetailsFragment}
`;

export function useUpdateHostFamily(
  options?: UseMutationOptions<
    HostFamily,
    Error,
    { currentHostFamily: HostFamily; formPayload: HostFamilyFormPayload }
  >
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<
    HostFamily,
    Error,
    { currentHostFamily: HostFamily; formPayload: HostFamilyFormPayload }
  >(
    async ({ currentHostFamily, formPayload }) => {
      const payload: UpdateHostFamilyPayload = {
        id: currentHostFamily.id,
      };

      formPayload.name = formPayload.name.trim();
      if (formPayload.name !== currentHostFamily.name) {
        if (formPayload.name === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_NAME);
        }

        payload.name = formPayload.name;
      }

      formPayload.phone = formPayload.phone.trim();
      if (formPayload.phone !== currentHostFamily.phone) {
        if (formPayload.phone === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_PHONE);
        }

        payload.phone = formPayload.phone;
      }

      formPayload.email = formPayload.email.trim();
      if (formPayload.email !== currentHostFamily.email) {
        if (!EMAIL_PATTERN.test(formPayload.email)) {
          throw new Error(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
        }

        payload.email = formPayload.email;
      }

      formPayload.address = formPayload.address.trim();
      if (formPayload.address !== currentHostFamily.address) {
        if (formPayload.address === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
        }

        payload.address = formPayload.address;
      }

      if (
        formPayload.housing != null &&
        formPayload.housing !== currentHostFamily.housing
      ) {
        payload.housing = formPayload.housing;
      }

      if (formPayload.hasChild !== currentHostFamily.hasChild) {
        payload.hasChild = formPayload.hasChild;
      }

      if (formPayload.hasGarden !== currentHostFamily.hasGarden) {
        payload.hasGarden = formPayload.hasGarden;
      }

      if (formPayload.hasVehicle !== currentHostFamily.hasVehicle) {
        payload.hasVehicle = formPayload.hasVehicle;
      }

      if (formPayload.linkToDrive !== currentHostFamily.linkToDrive) {
        payload.linkToDrive = formPayload.linkToDrive;
      }

      if (formPayload.linkToFacebook !== currentHostFamily.linkToFacebook) {
        payload.linkToFacebook = formPayload.linkToFacebook;
      }

      if (!isEqual(formPayload.ownAnimals, currentHostFamily.ownAnimals)) {
        payload.ownAnimals = formPayload.ownAnimals;
      }

      const { hostFamily } = await fetchGraphQL<
        { hostFamily: HostFamily },
        UpdateHostFamilyPayload
      >(UpdateHostFamilyQuery, { variables: payload });

      return hostFamily;
    },
    {
      ...options,

      errorCodesToIgnore: [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
        ErrorCode.HOST_FAMILY_MISSING_PHONE,
        ErrorCode.HOST_FAMILY_INVALID_EMAIL,
        ErrorCode.HOST_FAMILY_MISSING_ADDRESS,
        ErrorCode.HOST_FAMILY_MISSING_HOUSING,
      ],

      onSuccess(hostFamily, ...rest) {
        queryClient.setQueryData(["host-family", hostFamily.id], hostFamily);

        queryClient.setQueryData(
          "host-families",
          updateDataInInfiniteCache(toSearchableHostFamily(hostFamily))
        );

        showSnackbar.success(<Snackbar type="success">FA modifiée</Snackbar>);

        options?.onSuccess?.(hostFamily, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

const DeleteHostFamilyQuery = gql`
  mutation DeleteHostFamilyQuery($id: ID!) {
    deleteHostFamily(id: $id)
  }
`;

export function useDeleteHostFamily(
  options?: UseMutationOptions<string, Error, string>
) {
  const queryClient = useQueryClient();

  const { mutate, ...rest } = useMutation<string, Error, string>(
    async (hostFamilyId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteHostFamilyQuery, {
        variables: { id: hostFamilyId },
      });

      return hostFamilyId;
    },
    {
      ...options,

      onSuccess(hostFamilyId, ...rest) {
        queryClient.removeQueries(["host-family", hostFamilyId]);

        queryClient.setQueryData(
          "host-families",
          removeDataFromInfiniteCache(hostFamilyId)
        );

        // Invalidate it to make sure pagination is up to date.
        queryClient.invalidateQueries("host-families");

        showSnackbar.success(<Snackbar type="success">FA supprimée</Snackbar>);

        options?.onSuccess?.(hostFamilyId, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

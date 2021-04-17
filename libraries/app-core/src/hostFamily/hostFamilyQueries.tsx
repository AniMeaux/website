import {
  CreateHostFamilyPayload,
  EMAIL_PATTERN,
  ErrorCode,
  HostFamily,
  HostFamilyFormPayload,
  HostFamilySearch,
  PaginatedRequestParameters,
  PaginatedResponse,
  UpdateHostFamilyPayload,
} from "@animeaux/shared-entities";
import { showSnackbar, Snackbar } from "@animeaux/ui-library";
import { gql } from "graphql-request";
import * as React from "react";
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
} from "../request";

export const HostFamilyFragment = gql`
  fragment HostFamilyFragment on HostFamily {
    id
    name
    phone
    email
    zipCode
    city
    address
  }
`;

const GetAllHostFamiliesQuery = gql`
  query GetAllHostFamiliesQuery($search: String, $page: Int) {
    response: getAllHostFamilies(search: $search, page: $page) {
      hits {
        ...HostFamilyFragment
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${HostFamilyFragment}
`;

export function useAllHostFamilies(hostFamilySearch: HostFamilySearch = {}) {
  const queryClient = useQueryClient();

  return useInfiniteQuery<PaginatedResponse<HostFamily>, Error>(
    ["host-families", hostFamilySearch],
    async ({ pageParam = 0 }) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<HostFamily> },
        PaginatedRequestParameters<HostFamilySearch>
      >(GetAllHostFamiliesQuery, {
        variables: { page: pageParam, ...hostFamilySearch },
      });

      return response;
    },
    {
      onSuccess(data) {
        // As the objects are the same for the list and the details, we set all
        // values in the cache to avoid waiting for data we already have.
        data.pages.forEach((page) => {
          page.hits.forEach((hostFamily) => {
            queryClient.setQueryData(
              ["host-family", hostFamily.id],
              hostFamily
            );
          });
        });
      },
    }
  );
}

const GetHostFamilyQuery = gql`
  query GetHostFamilyQuery($id: ID!) {
    hostFamily: getHostFamily(id: $id) {
      ...HostFamilyFragment
    }
  }

  ${HostFamilyFragment}
`;

export function useHostFamily(hostFamilyId: string) {
  return useQuery<HostFamily | null, Error>(
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
}

const CreateHostFamilyQuery = gql`
  mutation CreateHostFamilyQuery(
    $name: String!
    $phone: String!
    $email: String!
    $zipCode: String!
    $city: String!
    $address: String!
  ) {
    hostFamily: createHostFamily(
      name: $name
      phone: $phone
      email: $email
      zipCode: $zipCode
      city: $city
      address: $address
    ) {
      ...HostFamilyFragment
    }
  }

  ${HostFamilyFragment}
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

      if (payload.zipCode.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE);
      }

      if (payload.city.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_CITY);
      }

      const createPayload: CreateHostFamilyPayload = payload;

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
        ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE,
        ErrorCode.HOST_FAMILY_MISSING_CITY,
        ErrorCode.HOST_FAMILY_MISSING_ADDRESS,
      ],

      onSuccess(hostFamily, ...rest) {
        queryClient.setQueryData(["host-family", hostFamily.id], hostFamily);

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryClient.invalidateQueries("host-families");

        showSnackbar.success(<Snackbar>FA créée</Snackbar>);

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
    $zipCode: String
    $city: String
    $address: String
  ) {
    hostFamily: updateHostFamily(
      id: $id
      name: $name
      phone: $phone
      email: $email
      zipCode: $zipCode
      city: $city
      address: $address
    ) {
      ...HostFamilyFragment
    }
  }

  ${HostFamilyFragment}
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

      const name = formPayload.name.trim();
      if (name !== currentHostFamily.name) {
        if (name === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_NAME);
        }

        payload.name = name;
      }

      const phone = formPayload.phone.trim();
      if (phone !== currentHostFamily.phone) {
        if (phone === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_PHONE);
        }

        payload.phone = phone;
      }

      const email = formPayload.email.trim();
      if (email !== currentHostFamily.email) {
        if (!EMAIL_PATTERN.test(email)) {
          throw new Error(ErrorCode.HOST_FAMILY_INVALID_EMAIL);
        }

        payload.email = email;
      }

      const address = formPayload.address.trim();
      if (address !== currentHostFamily.address) {
        if (address === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
        }

        payload.address = address;
      }

      const zipCode = formPayload.zipCode.trim();
      if (zipCode !== currentHostFamily.zipCode) {
        if (zipCode === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE);
        }

        payload.zipCode = zipCode;
      }

      const city = formPayload.city.trim();
      if (city !== currentHostFamily.city) {
        if (city === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_CITY);
        }

        payload.city = city;
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
        ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE,
        ErrorCode.HOST_FAMILY_MISSING_CITY,
        ErrorCode.HOST_FAMILY_MISSING_ADDRESS,
      ],

      onSuccess(hostFamily, ...rest) {
        queryClient.setQueryData(["host-family", hostFamily.id], hostFamily);

        setQueriesData(
          queryClient,
          "host-families",
          updateDataInInfiniteCache(hostFamily)
        );

        showSnackbar.success(<Snackbar>FA modifiée</Snackbar>);

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

        setQueriesData(
          queryClient,
          "host-families",
          removeDataFromInfiniteCache(hostFamilyId)
        );

        showSnackbar.success(<Snackbar>FA supprimée</Snackbar>);

        options?.onSuccess?.(hostFamilyId, ...rest);
      },
    }
  );

  return [mutate, rest] as const;
}

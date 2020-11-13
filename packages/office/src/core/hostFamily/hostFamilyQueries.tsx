import {
  CreateHostFamilyPayload,
  ErrorCode,
  HostFamily,
  HostFamilyFilters,
  HostFamilyFormPayload,
  PaginatedResponse,
  UpdateHostFamilyPayload,
} from "@animeaux/shared";
import { gql } from "graphql-request";
import { useRouter } from "next/router";
import * as React from "react";
import { useInfiniteQuery } from "react-query";
import { fetchGraphQL, useMutation, useQuery, useQueryCache } from "../request";

const HostFamilyCore = gql`
  fragment HostFamilyCore on HostFamily {
    id
    name
    address
    phone
  }
`;

const GetAllHostFamiliesQuery = gql`
  query GetAllHostFamiliesQuery($search: String, $page: Int) {
    response: getAllHostFamilies(search: $search, page: $page) {
      hits {
        ...HostFamilyCore
      }
      hitsTotalCount
      page
      pageCount
    }
  }

  ${HostFamilyCore}
`;

export function useAllHostFamilies({ search }: HostFamilyFilters = {}) {
  const { data, refetch, ...rest } = useInfiniteQuery<
    PaginatedResponse<HostFamily>,
    Error
  >(
    "host-families",
    async (key: string, page: number = 0) => {
      const { response } = await fetchGraphQL<
        { response: PaginatedResponse<HostFamily> },
        HostFamilyFilters
      >(GetAllHostFamiliesQuery, {
        variables: { search, page },
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
  }, [search, refetch]);

  return [data, { ...rest, refetch }] as const;
}

const GetHostFamilyQuery = gql`
  query GetHostFamilyQuery($id: ID!) {
    hostFamily: getHostFamily(id: $id) {
      ...HostFamilyCore
    }
  }

  ${HostFamilyCore}
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
    $address: String!
    $phone: String!
  ) {
    hostFamily: createHostFamily(
      name: $name
      address: $address
      phone: $phone
    ) {
      ...HostFamilyCore
    }
  }

  ${HostFamilyCore}
`;

export function useCreateHostFamily() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<HostFamily, Error, HostFamilyFormPayload>(
    async (payload) => {
      if (payload.name.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_NAME);
      }

      if (payload.address.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
      }

      if (payload.phone.trim() === "") {
        throw new Error(ErrorCode.HOST_FAMILY_MISSING_PHONE);
      }

      const { hostFamily } = await fetchGraphQL<
        { hostFamily: HostFamily },
        CreateHostFamilyPayload
      >(CreateHostFamilyQuery, { variables: payload });

      router.push(`/host-families/${hostFamily.id}`);
      return hostFamily;
    },
    {
      onSuccess(hostFamily) {
        queryCache.setQueryData(["host-family", hostFamily.id], hostFamily, {
          initialStale: true,
        });

        // We don't know where the data will be added to the list so we can't
        // manualy update the cache.
        queryCache.invalidateQueries("host-families");
      },
    }
  );
}

const UpdateHostFamilyQuery = gql`
  mutation UpdateHostFamilyQuery(
    $id: ID!
    $name: String
    $address: String
    $phone: String
  ) {
    hostFamily: updateHostFamily(
      id: $id
      name: $name
      address: $address
      phone: $phone
    ) {
      ...HostFamilyCore
    }
  }

  ${HostFamilyCore}
`;

export function useUpdateHostFamily() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<
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

      if (formPayload.address !== currentHostFamily.address) {
        if (formPayload.address === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_ADDRESS);
        }

        payload.address = formPayload.address;
      }

      if (formPayload.phone !== currentHostFamily.phone) {
        if (formPayload.phone === "") {
          throw new Error(ErrorCode.HOST_FAMILY_MISSING_PHONE);
        }

        payload.phone = formPayload.phone;
      }

      const { hostFamily } = await fetchGraphQL<
        { hostFamily: HostFamily },
        UpdateHostFamilyPayload
      >(UpdateHostFamilyQuery, { variables: payload });

      router.push(`/host-families/${hostFamily.id}`);
      return hostFamily;
    },
    {
      onSuccess(hostFamily) {
        queryCache.setQueryData(["host-family", hostFamily.id], hostFamily, {
          initialStale: true,
        });

        queryCache.setQueryData<PaginatedResponse<HostFamily>[]>(
          "host-families",
          (hostFamiliesPages) =>
            (hostFamiliesPages ?? []).map((page) => ({
              ...page,
              hits: page.hits.map((h) =>
                h.id === hostFamily.id ? hostFamily : h
              ),
            })),
          { initialStale: true }
        );
      },
    }
  );
}

const DeleteHostFamilyQuery = gql`
  mutation DeleteHostFamilyQuery($id: ID!) {
    deleteHostFamily(id: $id)
  }
`;

export function useDeleteHostFamily() {
  const router = useRouter();
  const queryCache = useQueryCache();

  return useMutation<string, Error, string>(
    async (hostFamilyId) => {
      await fetchGraphQL<boolean, { id: string }>(DeleteHostFamilyQuery, {
        variables: { id: hostFamilyId },
      });

      router.push("/host-families");
      return hostFamilyId;
    },
    {
      onSuccess(hostFamilyId) {
        queryCache.removeQueries(["host-family", hostFamilyId]);

        queryCache.setQueryData<PaginatedResponse<HostFamily>[]>(
          "host-families",
          (hostFamiliesPages) =>
            (hostFamiliesPages ?? []).map((page) => ({
              ...page,
              hits: page.hits.filter((h) => h.id !== hostFamilyId),
            })),
          { initialStale: true }
        );
      },
    }
  );
}

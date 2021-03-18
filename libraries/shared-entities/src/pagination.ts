export type SearchFilter = {
  search?: string | null;
};

export type PaginatedRequestParameters<
  FiltersType extends Object = {}
> = FiltersType & {
  page?: number | null;
};

export type PaginatedResponse<ResourceType> = {
  hits: ResourceType[];
  hitsTotalCount: number;
  page: number;
  pageCount: number;
};

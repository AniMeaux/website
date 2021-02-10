export type SearchFilter = {
  search?: string | null;
};

export type PaginatedRequest<FiltersType extends Object = {}> = FiltersType &
  SearchFilter & {
    page?: number | null;
  };

export type PaginatedResponse<ResourceType> = {
  hits: ResourceType[];
  hitsTotalCount: number;
  page: number;
  pageCount: number;
};

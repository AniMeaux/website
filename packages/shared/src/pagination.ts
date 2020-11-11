export type PaginatedResponse<ResourceType> = {
  hits: ResourceType[];
  hitsTotalCount: number;
  page: number;
  pageCount: number;
};

export type PaginatedRequest = {
  search?: string | null;
  page?: number | null;
};

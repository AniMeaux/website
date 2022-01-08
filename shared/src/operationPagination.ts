export type OperationPaginationParams = {
  page?: number;
};

export type OperationPaginationResult<TResult> = {
  hits: TResult[];
  hitsTotalCount: number;
  page: number;
  pageCount: number;
};

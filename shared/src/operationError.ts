export type OperationErrorResult<TCode extends string> = {
  code: TCode;
};

export type OmitOperationErrorResult<TResult> =
  TResult extends OperationErrorResult<any> ? never : TResult;

export type PickOperationErrorResult<TResult> =
  TResult extends OperationErrorResult<any> ? TResult : never;

import {
  AllOperationName,
  OmitOperationErrorResult,
  OperationResult,
  PickOperationErrorResult,
} from "@animeaux/shared";
import { ParameterizedContext } from "koa";
import { PartialDeep } from "type-fest";

export type OperationImpl<
  TOperation extends (...args: any) => any = (...args: any) => any
> = (
  params: PartialDeep<Parameters<TOperation>[0]>,
  context: ParameterizedContext
) => Promise<OmitOperationErrorResult<ReturnType<TOperation>>>;

export type OperationsImpl<
  TOperations extends Record<string, (...args: any) => any>
> = {
  [name in keyof TOperations]: OperationImpl<TOperations[name]>;
};

export class OperationError<TName extends AllOperationName> extends Error {
  status: number;
  errorBody: PickOperationErrorResult<OperationResult<TName>> | undefined;

  constructor(
    status: number,
    errorBody?: PickOperationErrorResult<OperationResult<TName>>
  ) {
    super(String(status));
    this.status = status;
    this.errorBody = errorBody;
  }
}

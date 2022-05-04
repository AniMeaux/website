import {
  AllOperationName,
  OmitOperationErrorResult,
  OperationParams,
  OperationResult,
  PickOperationErrorResult,
} from "@animeaux/shared";
import invariant from "invariant";
import { getConfig } from "~/core/config";

type OperationSuccessResult<TName extends AllOperationName> =
  OmitOperationErrorResult<OperationResult<TName>>;

type OperationSuccessResponse<TName extends AllOperationName> = {
  state: "success";
  result: OperationSuccessResult<TName>;
  status: number;
};

type OperationErrorResponse<TName extends AllOperationName> = {
  state: "error";
  errorResult?: PickOperationErrorResult<OperationResult<TName>>;
  status: number;
};

export type OperationResponse<TName extends AllOperationName> =
  | OperationSuccessResponse<TName>
  | OperationErrorResponse<TName>;

type OperationBodyWithoutParams<TName extends AllOperationName> = {
  name: TName;
  params?: undefined;
};

type OperationBodyWithParams<TName extends AllOperationName> = {
  name: TName;
  params: OperationParams<TName>;
};

type OperationBody<TName extends AllOperationName> = [
  OperationParams<TName>
] extends [undefined]
  ? OperationBodyWithoutParams<TName>
  : OperationBodyWithParams<TName>;

export async function runOperation<TName extends AllOperationName>(
  body: OperationBody<TName>
): Promise<OperationResponse<TName>> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${getConfig().apiUrl}/operation`, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

    const contentType = response.headers.get("content-type");

    if (response.ok) {
      invariant(
        contentType?.includes("application/json"),
        `Only JSON content type is supported for succesfull calls. Got ${contentType}.`
      );

      return {
        state: "success",
        status: response.status,
        result: await response.json(),
      };
    }

    if (contentType?.includes("application/json")) {
      return {
        state: "error",
        status: response.status,
        errorResult: await response.json(),
      };
    }

    return { state: "error", status: response.status };
  } catch (error) {
    return { state: "error", status: 503 };
  }
}

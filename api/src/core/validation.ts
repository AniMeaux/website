import { AllOperationName, OperationParams } from "@animeaux/shared";
import { PartialDeep } from "type-fest";
import { SchemaOf } from "yup";
import { OperationError } from "./operations";

export function validateParams<TName extends AllOperationName>(
  schema: SchemaOf<OperationParams<TName>>,
  rawParams: PartialDeep<OperationParams<TName>>
): OperationParams<TName> {
  try {
    const params = schema.validateSync(rawParams, {
      // We don't want unknown attributes to end up in the database
      stripUnknown: true,
    });

    return params as OperationParams<TName>;
  } catch (error) {
    console.error(error);
    throw new OperationError(400);
  }
}

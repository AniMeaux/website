import { getObjectSchemaKeys } from "@animeaux/zod-utils";
import type { z } from "zod";
import { toObject } from "./toObject";

export function createFormData<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
) {
  return {
    schema,
    keys: getObjectSchemaKeys(schema),

    parse(formData: FormData) {
      return schema.parse(toObject(formData)) as TSchema["_output"];
    },

    safeParse(formData: FormData) {
      return schema.safeParse(toObject(formData)) as z.SafeParseReturnType<
        TSchema["_input"],
        TSchema["_output"]
      >;
    },
  };
}

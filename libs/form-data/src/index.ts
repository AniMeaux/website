import { getObjectSchemaKeys } from "@animeaux/zod-utils";
import type { z } from "zod";

export function createFormData<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
) {
  return {
    schema,
    keys: getObjectSchemaKeys(schema),

    parse(formData: FormData) {
      return schema.parse(formDataToObject(formData)) as TSchema["_output"];
    },

    safeParse(formData: FormData) {
      return schema.safeParse(
        formDataToObject(formData),
      ) as z.SafeParseReturnType<TSchema["_input"], TSchema["_output"]>;
    },
  };
}

function formDataToObject(formData: FormData) {
  const map = new Map<string, unknown[]>();

  for (const [key, value] of formData) {
    const currentValue = map.get(key);

    if (currentValue == null) {
      map.set(key, [value]);
    } else {
      currentValue.push(value);
    }
  }

  return Object.fromEntries(
    Array.from(map.entries()).map(([key, value]) => [
      key,
      value.length === 1 ? value[0] : value,
    ]),
  );
}

import { zu } from "@animeaux/zod-utils";

export namespace FormDataDelegate {
  export function create<TSchema extends zu.ZodObject<any>>(schema: TSchema) {
    return {
      schema,
      keys: zu.getObjectKeys(schema),

      parse(formData: FormData) {
        return schema.parse(toObject(formData)) as TSchema["_output"];
      },

      safeParse(formData: FormData) {
        return schema.safeParse(toObject(formData)) as zu.SafeParseReturnType<
          TSchema["_input"],
          TSchema["_output"]
        >;
      },
    };
  }

  function toObject(data: FormData | URLSearchParams) {
    const map = new Map<string, unknown[]>();

    for (const [key, value] of data) {
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
}

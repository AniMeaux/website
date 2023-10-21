import { zu } from "@animeaux/zod-utils";
import { toObject } from "./toObject";

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
}

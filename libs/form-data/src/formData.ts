import { zu } from "@animeaux/zod-utils";
import type { z } from "zod";
import { toObject } from "./toObject";

export namespace FormDataDelegate {
  export function create<TSchema extends z.ZodObject<any>>(schema: TSchema) {
    return {
      schema,
      keys: zu.getObjectKeys(schema),

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
}

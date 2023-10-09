import { DateTime } from "luxon";
import { z } from "zod";

export namespace zu {
  export function getObjectKeys<TSchema extends z.ZodObject<any>>(
    schema: TSchema,
  ) {
    const keys = Object.fromEntries(
      Object.keys(schema.shape).map((key) => [key, key]),
    );

    return keys as ObjectSchemaKeys<TSchema>;
  }

  /**
   * Use DateTime instead of `z.coerce.date()` so missing parts can correctly
   * be infered from DateTime settings.
   */
  export function date(params?: Parameters<typeof z.date>[0]) {
    return z.preprocess((value) => {
      if (typeof value === "string") {
        if (value === "") {
          return undefined;
        }

        return DateTime.fromISO(value).toJSDate();
      }

      return value;
    }, z.date(params));
  }
}

type ObjectSchemaKeys<TSchema extends z.ZodObject<any>> = {
  [key in keyof Required<z.infer<TSchema>>]: key;
};

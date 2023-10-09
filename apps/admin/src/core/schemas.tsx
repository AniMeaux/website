import { zu } from "@animeaux/zod-utils";
import { z } from "zod";
import { zfd } from "zod-form-data";

export namespace zsp {
  export function date(
    transform: (date: undefined | Date) => undefined | Date,
  ) {
    return zu.date().optional().transform(transform).catch(undefined);
  }

  export function set<TSchema extends z.ZodType>(schema: TSchema) {
    return zfd
      .repeatable(schema.array().catch([]))
      .transform((array) => new Set(array));
  }

  export const text: InputType<z.ZodString> = (schema = z.string()) => {
    return zfd.text(schema.optional().catch(undefined)) as any;
  };

  export function checkbox() {
    return zfd.checkbox().catch(false);
  }

  export function optionalEnum<TEnum extends z.EnumLike>(values: TEnum) {
    return z.nativeEnum(values).optional().catch(undefined);
  }

  export function requiredEnum<TEnum extends z.EnumLike>(
    values: TEnum,
    defaultValue: TEnum[string | number],
  ) {
    return z.nativeEnum(values).catch(defaultValue);
  }
}

// Copied from:
// https://github.com/airjp73/remix-validated-form/blob/zod-form-data-v2.0.1/packages/zod-form-data/src/helpers.ts#L13
type InputType<DefaultType extends z.ZodTypeAny> = {
  (): z.ZodEffects<DefaultType>;
  <ProvidedType extends z.ZodTypeAny>(
    schema: ProvidedType,
  ): z.ZodEffects<ProvidedType>;
};

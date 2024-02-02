import { DateTime } from "luxon";
import { z } from "zod";
import { zfd } from "zod-form-data";

export {
  ZodObject,
  ZodType,
  array,
  boolean,
  enum,
  literal,
  nativeEnum,
  number,
  object,
  string,
  union,
} from "zod";
export type {
  SafeParseReturnType,
  ZodTypeAny,
  infer,
  inferFlattenedErrors,
} from "zod";
export { checkbox, repeatable, text } from "zod-form-data";

export const coerce = {
  ...z.coerce,

  date(param?: Parameters<typeof ZodDateTime.create>[0]) {
    return ZodDateTime.create({ ...param, coerce: true });
  },
};

export const searchParams = {
  boolean() {
    return zfd.text().pipe(zfd.checkbox()).catch(false);
  },

  date() {
    return zfd.text().pipe(coerce.date()).optional().catch(undefined);
  },

  nativeEnum<TEnum extends z.EnumLike>(values: TEnum) {
    return zfd.text().pipe(z.nativeEnum(values)).optional().catch(undefined);
  },

  number() {
    return zfd.numeric().optional().catch(undefined);
  },

  set<TValue extends z.ZodTypeAny = z.ZodTypeAny>(valueType: TValue) {
    return zfd
      .repeatableOfType(valueType)
      .transform((array) => array.filter(Boolean))
      .transform((array) => new Set(array))
      .catch(new Set());
  },

  string() {
    return zfd.text().optional().catch(undefined);
  },
};

export function getObjectKeys<TSchema extends z.ZodObject<any>>(
  schema: TSchema,
) {
  const keys = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, key]),
  );

  return keys as {
    [key in keyof Required<z.infer<TSchema>>]: key;
  };
}

class ZodDateTime extends z.ZodDate {
  static override create({
    coerce = false,
    ...params
  }: z.RawCreateParams & { coerce?: boolean } = {}) {
    return new ZodDateTime({
      checks: [],
      coerce,
      typeName: z.ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params),
    });
  }

  override _parse(input: z.ParseInput): z.ParseReturnType<this["_output"]> {
    // Coerce data using `DateTime.fromISO()` instead of `Date()` so missing
    // parts can correctly be infered from DateTime settings.
    if (this._def.coerce) {
      try {
        input.data = DateTime.fromISO(input.data).toJSDate();
      } catch (error) {}
    }

    return super._parse(input);
  }

  override _addCheck(check: z.ZodDateCheck) {
    return new ZodDateTime({
      ...this._def,
      checks: [...this._def.checks, check],
    });
  }
}

// Copied from zod.
// https://github.com/colinhacks/zod/blob/v3.22.2/src/types.ts#L128
function processCreateParams(
  params: z.RawCreateParams,
): z.ProcessedCreateParams {
  if (params == null) {
    return {};
  }

  const { errorMap, invalid_type_error, required_error, description } = params;

  if (
    errorMap != null &&
    (invalid_type_error != null || required_error != null)
  ) {
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  }

  if (errorMap != null) {
    return { errorMap, description };
  }

  return {
    description,

    errorMap: (iss, ctx) => {
      if (iss.code !== "invalid_type") {
        return { message: ctx.defaultError };
      }

      if (typeof ctx.data === "undefined") {
        return { message: required_error ?? ctx.defaultError };
      }

      return { message: invalid_type_error ?? ctx.defaultError };
    },
  };
}

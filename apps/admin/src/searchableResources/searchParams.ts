import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";
import { SearchableResourceType } from "~/searchableResources/type";

enum Keys {
  TEXT = "q",
  TYPE = "type",
}

const Type = {
  ...SearchableResourceType,
  ALL: "ALL",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
type Type = typeof Type[keyof typeof Type];

export class SearchableResourceSearchParams extends URLSearchParams {
  static readonly Keys = Keys;
  static readonly Type = Type;

  getText() {
    return this.get(Keys.TEXT) || null;
  }

  getType() {
    return parseOrDefault(
      z
        .nativeEnum(Type)
        .nullable()
        .optional()
        .default(null)
        .transform((type) => (type === Type.ALL ? null : type)),
      this.get(Keys.TYPE)
    );
  }
}

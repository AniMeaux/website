import isEqual from "lodash.isequal";
import invariant from "tiny-invariant";
import { z } from "zod";
import { toObject } from "./toObject";

export function createSearchParams<
  const TSchemaDeclaration extends Record<
    string,
    z.ZodType | KeyMappingDeclaration
  >,
>(schemaDeclaration: TSchemaDeclaration) {
  const attributeToKey = Object.fromEntries(
    Object.entries(schemaDeclaration).map(([attribute, schemaDeclaration]) => [
      attribute,
      schemaDeclaration instanceof z.ZodType
        ? attribute
        : schemaDeclaration.key,
    ]),
  ) as {
    [key in keyof TSchemaDeclaration]: TSchemaDeclaration[key] extends KeyMappingDeclaration
      ? TSchemaDeclaration[key]["key"]
      : key;
  };

  const keyToAttribute = Object.fromEntries(
    Object.entries(attributeToKey).map(([attribute, key]) => [key, attribute]),
  );

  const schema = z
    .object(
      Object.fromEntries(
        Object.entries(schemaDeclaration).map(
          ([attribute, schemaDeclaration]) =>
            schemaDeclaration instanceof z.ZodType
              ? [attribute, schemaDeclaration]
              : [schemaDeclaration.key, schemaDeclaration.schema],
        ),
      ),
    )
    .transform(
      (data) =>
        Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            keyToAttribute[key],
            value,
          ]),
        ) as InferType<TSchemaDeclaration>,
    );

  return {
    keys: attributeToKey,

    parse(searchParams: URLSearchParams) {
      return schema.parse(toObject(searchParams));
    },

    stringify(data: Partial<SerializeObject<InferType<TSchemaDeclaration>>>) {
      return this.create(data).toString();
    },

    create(data: Partial<SerializeObject<InferType<TSchemaDeclaration>>>) {
      const searchParams = new URLSearchParams();
      this.set(searchParams, data);
      return searchParams;
    },

    set(
      searchParams: URLSearchParams,
      nextData:
        | Partial<SerializeObject<InferType<TSchemaDeclaration>>>
        | ((
            nextData: InferType<TSchemaDeclaration>,
          ) => Partial<SerializeObject<InferType<TSchemaDeclaration>>>),
    ) {
      const data =
        typeof nextData === "function"
          ? nextData(this.parse(searchParams))
          : nextData;

      Object.entries(data).forEach(([attribute, value]) => {
        const key = attributeToKey[attribute];
        invariant(
          key != null,
          "The key should exists in the schema declaration.",
        );

        searchParams.delete(key);

        if (value == null) {
          return;
        }

        if (Array.isArray(value) || value instanceof Set) {
          return value.forEach((value) => {
            searchParams.append(key, String(value));
          });
        }

        searchParams.set(key, String(value));
      });
    },

    isEmpty(searchParams: URLSearchParams) {
      return this.areEqual(searchParams, new URLSearchParams());
    },

    areEqual(a: URLSearchParams, b: URLSearchParams) {
      return isEqual(this.parse(a), this.parse(b));
    },
  };
}

type SerializeValue<TValue> = TValue extends Date ? string : TValue;
type SerializeObject<TObject extends object> = {
  [key in keyof TObject]: SerializeValue<TObject[key]>;
};

type KeyMappingDeclaration = {
  key: string;
  schema: z.ZodType;
};

type GetSchema<TType> = TType extends z.ZodType
  ? TType
  : TType extends KeyMappingDeclaration
  ? TType["schema"]
  : never;

type InferType<
  TSchemaDeclaration extends Record<string, z.ZodType | KeyMappingDeclaration>,
> = {
  [key in keyof TSchemaDeclaration]: z.infer<
    GetSchema<TSchemaDeclaration[key]>
  >;
};

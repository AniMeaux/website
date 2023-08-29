import { useLocation, useNavigation, useSearchParams } from "@remix-run/react";
import isEqual from "lodash.isequal";
import { useCallback, useMemo } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const PageSearchParams = createSearchParams({
  page: zfd.numeric(z.number().int().min(0).catch(0)),
});

export const NextSearchParams = createSearchParams({
  next: zfd.text(z.string().optional().catch(undefined)),
});

export function useOptimisticSearchParams() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const nextSearchParams = useMemo(() => {
    if (navigation.location?.pathname === location.pathname) {
      return new URLSearchParams(navigation.location.search);
    }

    return undefined;
  }, [
    location.pathname,
    navigation.location?.pathname,
    navigation.location?.search,
  ]);

  const optimisticSearchParams = nextSearchParams ?? searchParams;

  // When the set state function is called with a function, it needs to recieve
  // the optimistic search parameters.
  const setOptimisticSearchParams = useCallback<typeof setSearchParams>(
    (nextInit, navigateOpts) => {
      setSearchParams(
        typeof nextInit === "function"
          ? nextInit(optimisticSearchParams)
          : nextInit,
        navigateOpts,
      );
    },
    [optimisticSearchParams, setSearchParams],
  );

  return [optimisticSearchParams, setOptimisticSearchParams] as const;
}

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

  const schema = zfd
    .formData(
      z.object(
        Object.fromEntries(
          Object.entries(schemaDeclaration).map(
            ([attribute, schemaDeclaration]) =>
              schemaDeclaration instanceof z.ZodType
                ? [attribute, schemaDeclaration]
                : [schemaDeclaration.key, schemaDeclaration.schema],
          ),
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
      return schema.parse(searchParams);
    },

    stringify(data: Partial<InferType<TSchemaDeclaration>>) {
      return this.create(data).toString();
    },

    create(data: Partial<InferType<TSchemaDeclaration>>) {
      const searchParams = new URLSearchParams();
      this.set(searchParams, data);
      return searchParams;
    },

    set(
      searchParams: URLSearchParams,
      nextData:
        | Partial<InferType<TSchemaDeclaration>>
        | ((
            nextData: InferType<TSchemaDeclaration>,
          ) => Partial<InferType<TSchemaDeclaration>>),
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

        if (Array.isArray(value) || value instanceof Set) {
          value.forEach((value) => {
            searchParams.append(key, String(value));
          });
        } else if (value != null) {
          searchParams.set(key, String(value));
        }
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

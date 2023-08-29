import type { Settings } from "@algolia/client-search";
import { Species, Status, UserGroup } from "@prisma/client";
import type { SearchClient, SearchIndex } from "algoliasearch";
import algoliasearch from "algoliasearch";
import invariant from "tiny-invariant";
import type { Simplify } from "type-fest";
import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALGOLIA_ID?: string;
      ALGOLIA_ADMIN_KEY?: string;
    }
  }
}

const ObjectWithId = z.object({
  id: z.string(),
});

// Use `nullable()` instead of `optional()` to align with prisma types.
const AnimalSchema = z.object({
  alias: z.string().nullable(),
  name: z.string(),
  pickUpLocation: z.string().nullable(),
  species: z.nativeEnum(Species),
  status: z.nativeEnum(Status),
  pickUpDate: z.coerce.date(),
});

const BreedSchema = z.object({
  name: z.string(),
  species: z.nativeEnum(Species),
});

const ColorSchema = z.object({
  name: z.string(),
});

const FosterFamilySchema = z.object({
  displayName: z.string(),
});

const UserSchema = z.object({
  displayName: z.string(),
  groups: z.nativeEnum(UserGroup).array(),
  isDisabled: z.boolean(),
});

export class AlgoliaClient {
  readonly animal: AlgoliaDelegate<typeof AnimalSchema>;
  readonly breed: AlgoliaDelegate<typeof BreedSchema>;
  readonly color: AlgoliaDelegate<typeof ColorSchema>;
  readonly fosterFamily: AlgoliaDelegate<typeof FosterFamilySchema>;
  readonly user: AlgoliaDelegate<typeof UserSchema>;

  constructor() {
    invariant(process.env.ALGOLIA_ID != null, "ALGOLIA_ID must be defined.");

    invariant(
      process.env.ALGOLIA_ADMIN_KEY != null,
      "ALGOLIA_ADMIN_KEY must be defined.",
    );

    const client = algoliasearch(
      process.env.ALGOLIA_ID,
      process.env.ALGOLIA_ADMIN_KEY,
    );
    this.animal = new AlgoliaDelegate<typeof AnimalSchema>(
      client,
      "animals",
      AnimalSchema,
    );
    this.breed = new AlgoliaDelegate<typeof BreedSchema>(
      client,
      "breeds",
      BreedSchema,
    );
    this.color = new AlgoliaDelegate<typeof ColorSchema>(
      client,
      "colors",
      ColorSchema,
    );
    this.fosterFamily = new AlgoliaDelegate<typeof FosterFamilySchema>(
      client,
      "fosterFamily",
      FosterFamilySchema,
    );
    this.user = new AlgoliaDelegate<typeof UserSchema>(
      client,
      "users",
      UserSchema,
    );
  }
}

class AlgoliaDelegate<TSchema extends z.ZodObject<any>> {
  readonly index: SearchIndex;

  constructor(
    client: SearchClient,
    indexName: string,
    private readonly schema: TSchema,
  ) {
    this.index = client.initIndex(indexName);
  }

  async partialUpdateObject(
    object: Simplify<z.infer<typeof ObjectWithId> & Partial<z.infer<TSchema>>>,
  ) {
    await this.index.partialUpdateObject(
      this.schema
        .partial()
        .merge(ObjectWithId)
        .transform(serializeObject)
        .transform(addAlgoliaObjectId)
        .parse(object),
    );
  }

  async saveObject(
    object: Simplify<z.infer<typeof ObjectWithId> & z.infer<TSchema>>,
  ) {
    await this.index.saveObject(
      this.schema
        .merge(ObjectWithId)
        .transform(serializeObject)
        .transform(addAlgoliaObjectId)
        .parse(object),
    );
  }

  async saveObjects(
    objects: Simplify<z.infer<typeof ObjectWithId> & z.infer<TSchema>>[],
  ) {
    await this.index.saveObjects(
      this.schema
        .merge(ObjectWithId)
        .array()
        .transform((objects) =>
          objects.map(serializeObject).map(addAlgoliaObjectId),
        )
        .parse(objects),
    );
  }

  async deleteObject(objectId: z.infer<typeof ObjectWithId>["id"]) {
    await this.index.deleteObject(objectId);
  }

  async clearObjects() {
    await this.index.clearObjects();
  }

  async setSettings(settings: IndexSettings<z.infer<TSchema>>) {
    await this.index.setSettings({
      ...settings,
      searchableAttributes: settings.searchableAttributes?.map((attribute) =>
        typeof attribute === "string" ? attribute : attribute.join(","),
      ),

      // Use markdown style bold.
      highlightPreTag: "**",
      highlightPostTag: "**",
    });
  }
}

function serializeObject(object: object) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => {
      if (value instanceof Date) {
        return [key, value.toISOString()];
      }

      return [key, value];
    }),
  );
}

function addAlgoliaObjectId(object: object) {
  return "id" in object && typeof object.id === "string"
    ? { objectID: object.id, ...object }
    : object;
}

type IndexSettings<
  TData extends object,
  TKeys extends string = RecursiveKeyOf<TData>,
> = Simplify<
  Omit<
    Settings,
    "searchableAttributes" | "attributesForFaceting" | "customRanking"
  > & {
    // https://www.algolia.com/doc/api-reference/api-parameters/searchableAttributes/
    searchableAttributes?: readonly (TKeys | `unordered(${TKeys})` | TKeys[])[];

    // https://www.algolia.com/doc/api-reference/api-parameters/attributesForFaceting/
    attributesForFaceting?: readonly (
      | TKeys
      | `searchable(${TKeys})`
      | `filterOnly(${TKeys})`
    )[];

    // https://www.algolia.com/doc/api-reference/api-parameters/customRanking/
    customRanking?: readonly (`asc(${TKeys})` | `desc(${TKeys})`)[];
  }
>;

type RecursiveKeyOf<TData> = TData extends object
  ? RecursiveObjectKeyOf<TData>
  : never;

type RecursiveObjectKeyOf<TObject extends object> = {
  [TKey in keyof TObject & (string | number)]: TObject[TKey] extends any[]
    ? `${TKey}`
    : // Don't list a date attributes because they are stored as numbers.
    TObject[TKey] extends Date
    ? `${TKey}`
    : TObject[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveObjectKeyOf<TObject[TKey]>}`
    : `${TKey}`;
}[keyof TObject & (string | number)];

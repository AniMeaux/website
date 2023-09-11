import type {
  SearchOptions,
  SearchResponse,
  Settings,
} from "@algolia/client-search";
import { isIterable } from "@animeaux/core";
import type { Species, Status, UserGroup } from "@prisma/client";
import type { SearchClient, SearchIndex } from "algoliasearch";
import algoliasearch from "algoliasearch";
import chunk from "lodash.chunk";
import invariant from "tiny-invariant";
import type { Simplify } from "type-fest";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALGOLIA_ID?: string;
      ALGOLIA_ADMIN_KEY?: string;
    }
  }
}

export class AlgoliaClient {
  readonly animal: AnimalDelegate;
  readonly breed: BreedDelegate;
  readonly color: ColorDelegate;
  readonly fosterFamily: FosterFamilyDelegate;
  readonly pickUpLocation: PickUpLocationDelegate;
  readonly user: UserDelegate;

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

    this.animal = new AnimalDelegate(client);
    this.breed = new BreedDelegate(client);
    this.color = new ColorDelegate(client);
    this.fosterFamily = new FosterFamilyDelegate(client);
    this.pickUpLocation = new PickUpLocationDelegate(client);
    this.user = new UserDelegate(client);
  }
}

abstract class IndexDelegate {
  readonly index: SearchIndex;

  constructor(client: SearchClient, indexName: string) {
    this.index = client.initIndex(indexName);
  }

  async delete(id: string) {
    return await this.index.deleteObject(id);
  }

  async deleteAll() {
    return await this.index.clearObjects();
  }
}

abstract class FacetDelegate {
  protected readonly index: SearchIndex;

  constructor(client: SearchClient, indexName: string) {
    this.index = client.initIndex(indexName);
  }
}

const DEFAULT_SETTINGS = {
  // Use markdown style bold.
  highlightPreTag: "**",
  highlightPostTag: "**",
} satisfies Settings;

type AlgoliaObject<TObject extends object = {}> = Simplify<
  { objectID: string } & TObject
>;

type UpdateData<TObject extends object> = Simplify<
  { id: string } & Partial<TObject>
>;

type PartialUpdateObjectParam<TObject extends object> = AlgoliaObject<
  Partial<SerializeObject<TObject>>
>;

type SaveObjectParam<TObject extends object> = AlgoliaObject<
  SerializeObject<TObject>
>;

type FindManyParam<TWhere extends object> = { where: TWhere } & Omit<
  SearchOptions,
  "filters" | "length" | "offset" | "page"
>;

type CreateData<TObject extends object> = Simplify<{ id: string } & TObject>;

type Hit<
  TObject extends object,
  THighlightedKey extends keyof TObject = keyof TObject,
> = Simplify<
  { id: string } & TObject & {
      _highlighted: { [key in THighlightedKey]: TObject[key] };
    }
>;

type SerializeValue<TValue> = TValue extends Date ? number : TValue;
export type SerializeObject<TObject extends object> = {
  [key in keyof TObject]: SerializeValue<TObject[key]>;
};

export type Animal = {
  alias: string | null;
  name: string;
  pickUpDate: Date;
  pickUpLocation: string | null;
  species: Species;
  status: Status;
};

export type AnimalHit = Hit<Animal, "alias" | "name">;

class AnimalDelegate extends IndexDelegate {
  constructor(client: SearchClient) {
    super(client, "animals");
  }

  async update(animal: UpdateData<Animal>) {
    return await this.index.partialUpdateObject({
      objectID: animal.id,
      alias: animal.alias,
      name: animal.name,
      pickUpDate: animal.pickUpDate?.getTime(),
      pickUpLocation: animal.pickUpLocation,
      species: animal.species,
      status: animal.status,
    } satisfies PartialUpdateObjectParam<Animal>);
  }

  async create(animal: CreateData<Animal>) {
    return await this.index.saveObject({
      objectID: animal.id,
      alias: animal.alias,
      name: animal.name,
      pickUpDate: animal.pickUpDate.getTime(),
      pickUpLocation: animal.pickUpLocation,
      species: animal.species,
      status: animal.status,
    } satisfies SaveObjectParam<Animal>);
  }

  async createMany(animals: CreateData<Animal>[]) {
    return await this.index.saveObjects(
      animals.map<SaveObjectParam<Animal>>((animal) => ({
        objectID: animal.id,
        alias: animal.alias,
        name: animal.name,
        pickUpDate: animal.pickUpDate.getTime(),
        pickUpLocation: animal.pickUpLocation,
        species: animal.species,
        status: animal.status,
      })),
    );
  }

  async findMany({
    where: { nameOrAlias, ...filters },
    ...options
  }: FindManyParam<{
    nameOrAlias: string;
    pickUpDate?: DateTimeFilter;
    pickUpLocation?: string | Iterable<string>;
    species?: Species | Iterable<Species>;
    status?: Status | Iterable<Status>;
  }>) {
    let response: SearchResponse<SerializeObject<Animal>>;

    if (options.hitsPerPage == null) {
      response = await searchAll<SerializeObject<Animal>>(
        this.index,
        nameOrAlias,
        { ...options, filters: createSearchFilters(filters) },
      );
    } else {
      response = await this.index.search<SerializeObject<Animal>>(nameOrAlias, {
        ...options,
        filters: createSearchFilters(filters),
      });
    }

    return response.hits.map<AnimalHit>((hit) => ({
      id: hit.objectID,
      alias: hit.alias,
      name: hit.name,
      pickUpDate: new Date(hit.pickUpDate),
      pickUpLocation: hit.pickUpLocation,
      species: hit.species,
      status: hit.status,
      _highlighted: {
        alias: hit._highlightResult?.alias?.value ?? hit.alias,
        name: hit._highlightResult?.name?.value ?? hit.name,
      },
    }));
  }

  async uploadSettings() {
    return await this.index.setSettings({
      ...DEFAULT_SETTINGS,
      searchableAttributes: ["name", "alias"],
      attributesForFaceting: [
        "pickUpDate",
        "searchable(pickUpLocation)",
        "species",
        "status",
      ],
      customRanking: ["desc(pickUpDate)"],
      maxFacetHits: 20,
    } satisfies SetSettingsParam<Animal>);
  }
}

export type Location = {
  value: string;
};

export type LocationHit = Hit<Location, "value">;

class PickUpLocationDelegate extends FacetDelegate {
  constructor(client: SearchClient) {
    super(client, "animals");
  }

  async findMany({
    where: { value },
    ...options
  }: FindManyParam<{ value: string }>) {
    const response = await this.index.searchForFacetValues(
      "pickUpLocation",
      value,
      options,
    );

    return response.facetHits.map<LocationHit>((hit) => ({
      id: hit.value,
      value: hit.value,
      _highlighted: {
        value: hit.highlighted,
      },
    }));
  }
}

export type Breed = {
  name: string;
  species: Species;
};

export type BreedHit = Hit<Breed, "name">;

class BreedDelegate extends IndexDelegate {
  constructor(client: SearchClient) {
    super(client, "breeds");
  }

  async update(breed: UpdateData<Breed>) {
    return await this.index.partialUpdateObject({
      objectID: breed.id,
      name: breed.name,
      species: breed.species,
    } satisfies PartialUpdateObjectParam<Breed>);
  }

  async create(breed: CreateData<Breed>) {
    return await this.index.saveObject({
      objectID: breed.id,
      name: breed.name,
      species: breed.species,
    } satisfies SaveObjectParam<Breed>);
  }

  async createMany(breeds: CreateData<Breed>[]) {
    return await this.index.saveObjects(
      breeds.map<SaveObjectParam<Breed>>((breed) => ({
        objectID: breed.id,
        name: breed.name,
        species: breed.species,
      })),
    );
  }

  async findMany({
    where: { name, ...filters },
    ...options
  }: FindManyParam<{
    name: string;
    species?: Species | Iterable<Species>;
  }>) {
    let response: SearchResponse<SerializeObject<Breed>>;

    if (options.hitsPerPage == null) {
      response = await searchAll<SerializeObject<Breed>>(this.index, name, {
        ...options,
        filters: createSearchFilters(filters),
      });
    } else {
      response = await this.index.search<SerializeObject<Breed>>(name, {
        ...options,
        filters: createSearchFilters(filters),
      });
    }

    return response.hits.map<BreedHit>((hit) => {
      return {
        id: hit.objectID,
        name: hit.name,
        species: hit.species,
        _highlighted: {
          name: hit._highlightResult?.name?.value ?? hit.name,
        },
      };
    });
  }

  async uploadSettings() {
    await this.index.setSettings({
      ...DEFAULT_SETTINGS,
      searchableAttributes: ["name"],
      attributesForFaceting: ["species"],
    } satisfies SetSettingsParam<Breed>);
  }
}

export type Color = {
  name: string;
};

export type ColorHit = Hit<Color>;

class ColorDelegate extends IndexDelegate {
  constructor(client: SearchClient) {
    super(client, "colors");
  }

  async update(color: UpdateData<Color>) {
    return await this.index.partialUpdateObject({
      objectID: color.id,
      name: color.name,
    } satisfies PartialUpdateObjectParam<Color>);
  }

  async create(color: CreateData<Color>) {
    return await this.index.saveObject({
      objectID: color.id,
      name: color.name,
    } satisfies SaveObjectParam<Color>);
  }

  async createMany(colors: CreateData<Color>[]) {
    return await this.index.saveObjects(
      colors.map<SaveObjectParam<Color>>((color) => ({
        objectID: color.id,
        name: color.name,
      })),
    );
  }

  async findMany({
    where: { name },
    ...options
  }: FindManyParam<{ name: string }>) {
    let response: SearchResponse<SerializeObject<Color>>;

    if (options.hitsPerPage == null) {
      response = await searchAll<SerializeObject<Color>>(
        this.index,
        name,
        options,
      );
    } else {
      response = await this.index.search<SerializeObject<Color>>(name, options);
    }

    return response.hits.map<ColorHit>((hit) => {
      return {
        id: hit.objectID,
        name: hit.name,
        _highlighted: {
          name: hit._highlightResult?.name?.value ?? hit.name,
        },
      };
    });
  }

  async uploadSettings() {
    await this.index.setSettings({
      ...DEFAULT_SETTINGS,
      searchableAttributes: ["name"],
    } satisfies SetSettingsParam<Color>);
  }
}

export type FosterFamily = {
  displayName: string;
};

export type FosterFamilyHit = Hit<FosterFamily>;

class FosterFamilyDelegate extends IndexDelegate {
  constructor(client: SearchClient) {
    super(client, "fosterFamily");
  }

  async update(fosterFamily: UpdateData<FosterFamily>) {
    return await this.index.partialUpdateObject({
      objectID: fosterFamily.id,
      displayName: fosterFamily.displayName,
    } satisfies PartialUpdateObjectParam<FosterFamily>);
  }

  async create(fosterFamily: CreateData<FosterFamily>) {
    return await this.index.saveObject({
      objectID: fosterFamily.id,
      displayName: fosterFamily.displayName,
    } satisfies SaveObjectParam<FosterFamily>);
  }

  async createMany(fosterFamilies: CreateData<FosterFamily>[]) {
    return await this.index.saveObjects(
      fosterFamilies.map<SaveObjectParam<FosterFamily>>((object) => ({
        objectID: object.id,
        displayName: object.displayName,
      })),
    );
  }

  async findMany({
    where: { displayName },
    ...options
  }: FindManyParam<{ displayName: string }>) {
    let response: SearchResponse<SerializeObject<FosterFamily>>;

    if (options.hitsPerPage == null) {
      response = await searchAll<SerializeObject<FosterFamily>>(
        this.index,
        displayName,
        options,
      );
    } else {
      response = await this.index.search<SerializeObject<FosterFamily>>(
        displayName,
        options,
      );
    }

    return response.hits.map<FosterFamilyHit>((hit) => {
      return {
        id: hit.objectID,
        displayName: hit.displayName,
        _highlighted: {
          displayName:
            hit._highlightResult?.displayName?.value ?? hit.displayName,
        },
      };
    });
  }

  async uploadSettings() {
    await this.index.setSettings({
      ...DEFAULT_SETTINGS,
      searchableAttributes: ["displayName"],
    } satisfies SetSettingsParam<FosterFamily>);
  }
}

export type User = {
  displayName: string;
  groups: UserGroup[];
  isDisabled: boolean;
};

export type UserHit = Hit<User, "displayName">;

class UserDelegate extends IndexDelegate {
  constructor(client: SearchClient) {
    super(client, "users");
  }

  async update(user: UpdateData<User>) {
    return await this.index.partialUpdateObject({
      objectID: user.id,
      displayName: user.displayName,
      groups: user.groups,
      isDisabled: user.isDisabled,
    } satisfies PartialUpdateObjectParam<User>);
  }

  async create(user: CreateData<User>) {
    return await this.index.saveObject({
      objectID: user.id,
      displayName: user.displayName,
      groups: user.groups,
      isDisabled: user.isDisabled,
    } satisfies SaveObjectParam<User>);
  }

  async createMany(users: CreateData<User>[]) {
    return await this.index.saveObjects(
      users.map<SaveObjectParam<User>>((user) => ({
        objectID: user.id,
        displayName: user.displayName,
        groups: user.groups,
        isDisabled: user.isDisabled,
      })),
    );
  }

  async findMany({
    where: { displayName, ...filters },
    ...options
  }: FindManyParam<{
    displayName: string;
    groups?: UserGroup | Iterable<UserGroup>;
    isDisabled?: boolean;
  }>) {
    let response: SearchResponse<SerializeObject<User>>;

    if (options.hitsPerPage == null) {
      response = await searchAll<SerializeObject<User>>(
        this.index,
        displayName,
        { ...options, filters: createSearchFilters(filters) },
      );
    } else {
      response = await this.index.search<SerializeObject<User>>(displayName, {
        ...options,
        filters: createSearchFilters(filters),
      });
    }

    return response.hits.map<UserHit>((hit) => {
      return {
        id: hit.objectID,
        displayName: hit.displayName,
        groups: hit.groups,
        isDisabled: hit.isDisabled,
        _highlighted: {
          displayName:
            hit._highlightResult?.displayName?.value ?? hit.displayName,
        },
      };
    });
  }

  async uploadSettings() {
    await this.index.setSettings({
      ...DEFAULT_SETTINGS,
      searchableAttributes: ["displayName"],
      attributesForFaceting: ["groups", "isDisabled"],
    } satisfies SetSettingsParam<User>);
  }
}

type SetSettingsParam<
  TData extends object,
  TKeys extends string = RecursiveKeyOf<TData>,
> = Simplify<
  Omit<
    Settings,
    "searchableAttributes" | "attributesForFaceting" | "customRanking"
  > & {
    // We don't support comma separated list (e.g. `'attribute2, attribute3'`).
    // https://www.algolia.com/doc/api-reference/api-parameters/searchableAttributes/
    searchableAttributes?: readonly (TKeys | `unordered(${TKeys})`)[];

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

type DateTimeFilter = {
  gte?: Date;
  lte?: Date;
};

function createSearchFilters(
  params?: Record<
    string,
    undefined | null | boolean | string | DateTimeFilter | Iterable<string>
  >,
): string | undefined {
  if (params == null) {
    return undefined;
  }

  let filters: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      if (isIterable(value)) {
        const values = Array.from(value);
        if (values.length > 0) {
          filters.push(values.map((value) => `${key}:${value}`).join(" OR "));
        }
      } else if (typeof value === "object") {
        const dateTimeFilter = getDateTimeFilter(value);
        if (dateTimeFilter != null) {
          if (dateTimeFilter.includes(" TO ")) {
            filters.push([key, dateTimeFilter].join(":"));
          } else {
            filters.push([key, dateTimeFilter].join(" "));
          }
        }
      } else {
        filters.push([key, value].join(":"));
      }
    }
  });

  if (filters.length === 0) {
    return undefined;
  }

  if (filters.length > 1) {
    filters = filters.map((value) =>
      value.includes(" OR ") ? `(${value})` : value,
    );
  }

  return filters.join(" AND ");
}

function getDateTimeFilter(value: DateTimeFilter) {
  if (value.gte != null && value.lte != null) {
    return [value.gte.getTime(), value.lte.getTime()].join(" TO ");
  }

  if (value.gte != null) {
    return `>= ${value.gte.getTime()}`;
  }

  if (value.lte != null) {
    return `<= ${value.lte.getTime()}`;
  }

  return null;
}

const HITS_PER_BATCH = 50;
const REQUEST_COUNT_PER_BATCH = 10;

/**
 * Algolia searches are paginated by default.
 * This function will fetch all hits if `hitsPerPage` is not specified.
 *
 * @param index The index to search.
 * @param query The query
 * @param options The search options
 * @returns Results hits.
 */
async function searchAll<TObject extends object>(
  index: SearchIndex,
  query: string,
  options?: SearchOptions,
): Promise<SearchResponse<TObject>> {
  const firstResult = await index.search<TObject>(query, {
    ...options,
    hitsPerPage: HITS_PER_BATCH,
    page: 0,
  });

  const otherResults = await batchRequests({
    totalCount: firstResult.nbPages - 1,
    countPerBatch: REQUEST_COUNT_PER_BATCH,
    request: (requestIndex) => {
      return index.search<TObject>(query, {
        ...options,
        hitsPerPage: HITS_PER_BATCH,
        page: requestIndex + 1,
      });
    },
  });

  return {
    ...firstResult,
    hits: firstResult.hits.concat(
      otherResults.flatMap((result) => result.hits),
    ),
  };
}

async function batchRequests<T>({
  totalCount,
  countPerBatch,
  request,
}: {
  totalCount: number;
  countPerBatch: number;
  request: (index: number) => Promise<T>;
}) {
  const chunks = chunk(
    Array.from({ length: totalCount }, (_, index) => index),
    countPerBatch,
  );

  let allResults: T[] = [];
  for (const chunk of chunks) {
    allResults = allResults.concat(await Promise.all(chunk.map(request)));
  }

  return allResults;
}

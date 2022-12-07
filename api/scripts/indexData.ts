import { Settings } from "@algolia/client-search";
import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";
import { AnimalFromAlgolia, AnimalIndex } from "../src/entities/animal.entity";
import {
  BreedFromAlgolia,
  BreedIndex,
} from "../src/entities/animalBreed.entity";
import {
  ColorFromAlgolia,
  ColorIndex,
} from "../src/entities/animalColor.entity";
import {
  FosterFamilyFromAlgolia,
  FosterFamilyIndex,
} from "../src/entities/fosterFamily.entity";
import { UserFromAlgolia, UserIndex } from "../src/entities/user.entity";

const TABLES = [
  "all",
  "animal",
  "breed",
  "color",
  "fosterFamily",
  "user",
] as const;

const prisma = new PrismaClient();

const DEFAULT_SEARCH_OPTIONS: Omit<
  Settings,
  "searchableAttributes" | "attributesForFaceting"
> = {
  // Use markdown style bold.
  highlightPreTag: "**",
  highlightPostTag: "**",
};

indexData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function indexData() {
  const table = (process.argv[2] as typeof TABLES[number]) || "all";
  invariant(
    TABLES.includes(table),
    `Invalid table "${table}". Must be one of: ${TABLES.join(", ")}.`
  );

  console.log(`🗂 Indexing ${table}...`);

  const promises: Promise<void>[] = [];

  if (table === "all" || table === "animal") {
    promises.push(indexAnimals());
  }

  if (table === "all" || table === "breed") {
    promises.push(indexBreeds());
  }

  if (table === "all" || table === "color") {
    promises.push(indexColors());
  }

  if (table === "all" || table === "fosterFamily") {
    promises.push(indexFosterFamilies());
  }

  if (table === "all" || table === "user") {
    promises.push(indexUsers());
  }

  await Promise.all(promises);

  console.log(`🎉 Data is indexed`);
}

async function indexAnimals() {
  const animals = await prisma.animal.findMany({
    select: {
      id: true,
      name: true,
      alias: true,
      species: true,
      status: true,
      pickUpLocation: true,
    },
  });

  await AnimalIndex.clearObjects();

  await AnimalIndex.saveObjects(
    animals.map(({ id, ...animal }) => {
      const animalFromAlgolia: AnimalFromAlgolia = animal;
      return { ...animalFromAlgolia, objectID: id };
    })
  );

  const indexSettings: TypedIndexSettings<AnimalFromAlgolia> = {
    ...DEFAULT_SEARCH_OPTIONS,
    searchableAttributes: ["name", "alias"],
    attributesForFaceting: ["searchable(pickUpLocation)", "species", "status"],
    maxFacetHits: 20,
  };

  await AnimalIndex.setSettings(indexSettings);
}

async function indexBreeds() {
  const breeds = await prisma.breed.findMany({
    select: { id: true, name: true, species: true },
  });

  await BreedIndex.clearObjects();

  await BreedIndex.saveObjects(
    breeds.map(({ id, ...breed }) => {
      const breedFromAlgolia: BreedFromAlgolia = breed;
      return { ...breedFromAlgolia, objectID: id };
    })
  );

  const indexSettings: TypedIndexSettings<BreedFromAlgolia> = {
    ...DEFAULT_SEARCH_OPTIONS,
    searchableAttributes: ["name"],
    attributesForFaceting: ["species"],
  };

  await BreedIndex.setSettings(indexSettings);
}

async function indexColors() {
  const colors = await prisma.color.findMany({
    select: { id: true, name: true },
  });

  await ColorIndex.clearObjects();

  await ColorIndex.saveObjects(
    colors.map(({ id, ...color }) => {
      const colorFromAlgolia: ColorFromAlgolia = color;
      return { ...colorFromAlgolia, objectID: id };
    })
  );

  const indexSettings: TypedIndexSettings<ColorFromAlgolia> = {
    ...DEFAULT_SEARCH_OPTIONS,
    searchableAttributes: ["name"],
  };

  await ColorIndex.setSettings(indexSettings);
}

async function indexUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      displayName: true,
      groups: true,
      isDisabled: true,
    },
  });

  await UserIndex.clearObjects();

  await UserIndex.saveObjects(
    users.map(({ id, ...user }) => {
      const userFromAlgolia: UserFromAlgolia = user;
      return { ...userFromAlgolia, objectID: id };
    })
  );

  const indexSettings: TypedIndexSettings<UserFromAlgolia> = {
    ...DEFAULT_SEARCH_OPTIONS,
    searchableAttributes: ["displayName", "email"],
    attributesForFaceting: ["groups", "isDisabled"],
  };

  await UserIndex.setSettings(indexSettings);
}

async function indexFosterFamilies() {
  const fosterFamilies = await prisma.fosterFamily.findMany({
    select: { id: true, displayName: true },
  });

  await FosterFamilyIndex.clearObjects();

  await FosterFamilyIndex.saveObjects(
    fosterFamilies.map(({ id, ...fosterFamily }) => {
      const fosterFamilyFromAlgolia: FosterFamilyFromAlgolia = fosterFamily;
      return { ...fosterFamilyFromAlgolia, objectID: id };
    })
  );

  const indexSettings: TypedIndexSettings<FosterFamilyFromAlgolia> = {
    ...DEFAULT_SEARCH_OPTIONS,
    searchableAttributes: ["displayName"],
  };

  await FosterFamilyIndex.setSettings(indexSettings);
}

type StringOnlyKeys<TKey extends string | number | symbol> = TKey extends string
  ? TKey
  : never;

type TypedIndexSettings<
  TData extends object,
  TKeys extends string = StringOnlyKeys<keyof TData>
> = Omit<Settings, "searchableAttributes" | "attributesForFaceting"> & {
  // https://www.algolia.com/doc/api-reference/api-parameters/searchableAttributes/
  searchableAttributes?: readonly (TKeys | `unordered(${TKeys})`)[];

  // https://www.algolia.com/doc/api-reference/api-parameters/attributesForFaceting/
  attributesForFaceting?: readonly (
    | TKeys
    | `searchable(${TKeys})`
    | `filterOnly(${TKeys})`
  )[];
};

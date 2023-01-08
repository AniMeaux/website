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

indexData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function indexData() {
  const table = process.argv[2] as null | typeof TABLES[number];
  invariant(table != null, `Please choose a table in: ${TABLES.join(", ")}.`);
  invariant(
    TABLES.includes(table),
    `Invalid table "${table}". Must be one of: ${TABLES.join(", ")}.`
  );

  console.log(`🗄 Indexing ${table}...`);

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
      pickUpDate: true,
    },
  });

  await AnimalIndex.clearObjects();

  await AnimalIndex.saveObjects(
    animals.map(({ id, ...animal }) => {
      const animalFromAlgolia: AnimalFromAlgolia = {
        ...animal,
        pickUpDate: animal.pickUpDate.getTime(),
      };

      return { ...animalFromAlgolia, objectID: id };
    })
  );

  const indexSettings = createIndexSettings<AnimalFromAlgolia>({
    searchableAttributes: ["name", "alias"],
    attributesForFaceting: ["searchable(pickUpLocation)", "species", "status"],
    customRanking: ["desc(pickUpDate)"],
    maxFacetHits: 20,
  });

  await AnimalIndex.setSettings(indexSettings);

  console.log(
    `- 👍 Indexed ${animals.length} animals with settings:`,
    JSON.stringify(indexSettings)
  );
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

  const indexSettings = createIndexSettings<BreedFromAlgolia>({
    searchableAttributes: ["name"],
    attributesForFaceting: ["species"],
  });

  await BreedIndex.setSettings(indexSettings);

  console.log(
    `- 👍 Indexed ${breeds.length} breeds with settings:`,
    JSON.stringify(indexSettings)
  );
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

  const indexSettings = createIndexSettings<ColorFromAlgolia>({
    searchableAttributes: ["name"],
  });

  await ColorIndex.setSettings(indexSettings);

  console.log(
    `- 👍 Indexed ${colors.length} colors with settings:`,
    JSON.stringify(indexSettings)
  );
}

async function indexUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
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

  const indexSettings = createIndexSettings<UserFromAlgolia>({
    searchableAttributes: ["displayName"],
    attributesForFaceting: ["groups", "isDisabled"],
  });

  await UserIndex.setSettings(indexSettings);

  console.log(
    `- 👍 Indexed ${users.length} users with settings:`,
    JSON.stringify(indexSettings)
  );
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

  const indexSettings = createIndexSettings<FosterFamilyFromAlgolia>({
    searchableAttributes: ["displayName"],
  });

  await FosterFamilyIndex.setSettings(indexSettings);

  console.log(
    `- 👍 Indexed ${fosterFamilies.length} foster families with settings:`,
    JSON.stringify(indexSettings)
  );
}

function createIndexSettings<TData extends object>(
  settings: TypedIndexSettings<TData>
) {
  return {
    ...settings,
    searchableAttributes: settings.searchableAttributes?.map((attribute) =>
      typeof attribute === "string" ? attribute : attribute.join(",")
    ),

    // Use markdown style bold.
    highlightPreTag: "**",
    highlightPostTag: "**",
  };
}

type TypedIndexSettings<
  TData extends object,
  TKeys extends string = RecursiveKeyOf<TData>
> = Omit<
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
};

type RecursiveKeyOf<D> = D extends object ? RecursiveObjectKeyOf<D> : never;

type RecursiveObjectKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends any[]
    ? `${TKey}`
    : TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveObjectKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

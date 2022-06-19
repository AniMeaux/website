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
  // TODO
] as const;

type Table = typeof TABLES[number];

const prisma = new PrismaClient();

indexData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function indexData() {
  const table = (process.argv[2] as Table) || "all";
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
}

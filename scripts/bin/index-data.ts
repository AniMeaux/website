#!/usr/bin/env tsx

import "#env";
import { AlgoliaClient } from "@animeaux/algolia-client";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const ENTITY_NAMES = [
  "animal",
  "breed",
  "color",
  "fosterFamily",
  "user",
] as const;

type EntityName = (typeof ENTITY_NAMES)[number];

const entityName = z
  .union([z.literal("all"), z.enum(ENTITY_NAMES)])
  .parse(process.argv[2]);

console.log(`🗄 Indexing ${entityName}...`);

const indexors: Record<EntityName, () => Promise<void>> = {
  async animal() {
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

    await algolia.animal.deleteAll();
    await algolia.animal.uploadSettings();
    await algolia.animal.createMany(animals);

    console.log(`- 👍 Indexed ${animals.length} animals`);
  },

  async breed() {
    const breeds = await prisma.breed.findMany({
      select: { id: true, name: true, species: true },
    });

    await algolia.breed.deleteAll();
    await algolia.breed.uploadSettings();
    await algolia.breed.createMany(breeds);

    console.log(`- 👍 Indexed ${breeds.length} breeds`);
  },

  async color() {
    const colors = await prisma.color.findMany({
      select: { id: true, name: true },
    });

    await algolia.color.deleteAll();
    await algolia.color.uploadSettings();
    await algolia.color.createMany(colors);

    console.log(`- 👍 Indexed ${colors.length} colors`);
  },

  async fosterFamily() {
    const fosterFamilies = await prisma.fosterFamily.findMany({
      select: { id: true, displayName: true },
    });

    await algolia.fosterFamily.deleteAll();
    await algolia.fosterFamily.uploadSettings();
    await algolia.fosterFamily.createMany(fosterFamilies);

    console.log(`- 👍 Indexed ${fosterFamilies.length} foster families`);
  },

  async user() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        groups: true,
        isDisabled: true,
      },
    });

    await algolia.user.deleteAll();
    await algolia.user.uploadSettings();
    await algolia.user.createMany(users);

    console.log(`- 👍 Indexed ${users.length} users`);
  },
};

const algolia = new AlgoliaClient();
const prisma = new PrismaClient();

try {
  if (entityName === "all") {
    await Promise.all(Object.values(indexors).map((indexor) => indexor()));
  } else {
    await indexors[entityName]();
  }
} finally {
  await prisma.$disconnect();
}

console.log(`🎉 Data is indexed`);

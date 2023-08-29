#!/usr/bin/env ts-node

import "#env.ts";
import { AlgoliaClient } from "@animeaux/algolia-client";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const entityName = z
  .enum(["all", "animals", "breeds", "colors", "fosterFamilies", "users"])
  .parse(process.argv[2]);

const algolia = new AlgoliaClient();
const prisma = new PrismaClient();

indexData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function indexData() {
  console.log(`🗄 Indexing ${entityName}...`);

  const promises: Promise<void>[] = [];

  if (entityName === "all" || entityName === "animals") {
    promises.push(indexAnimals());
  }

  if (entityName === "all" || entityName === "breeds") {
    promises.push(indexBreeds());
  }

  if (entityName === "all" || entityName === "colors") {
    promises.push(indexColors());
  }

  if (entityName === "all" || entityName === "fosterFamilies") {
    promises.push(indexFosterFamilies());
  }

  if (entityName === "all" || entityName === "users") {
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

  await algolia.animal.clearObjects();
  await algolia.animal.saveObjects(animals);

  const settings: Parameters<typeof algolia.animal.setSettings>[0] = {
    searchableAttributes: ["name", "alias"],
    attributesForFaceting: ["searchable(pickUpLocation)", "species", "status"],
    customRanking: ["desc(pickUpDate)"],
    maxFacetHits: 20,
  };

  await algolia.animal.setSettings(settings);

  console.log(
    `- 👍 Indexed ${animals.length} animals with settings:`,
    JSON.stringify(settings),
  );
}

async function indexBreeds() {
  const breeds = await prisma.breed.findMany({
    select: { id: true, name: true, species: true },
  });

  await algolia.breed.clearObjects();
  await algolia.breed.saveObjects(breeds);

  const settings: Parameters<typeof algolia.breed.setSettings>[0] = {
    searchableAttributes: ["name"],
    attributesForFaceting: ["species"],
  };

  await algolia.breed.setSettings(settings);

  console.log(
    `- 👍 Indexed ${breeds.length} breeds with settings:`,
    JSON.stringify(settings),
  );
}

async function indexColors() {
  const colors = await prisma.color.findMany({
    select: { id: true, name: true },
  });

  await algolia.color.clearObjects();
  await algolia.color.saveObjects(colors);

  const settings: Parameters<typeof algolia.color.setSettings>[0] = {
    searchableAttributes: ["name"],
  };

  await algolia.color.setSettings(settings);

  console.log(
    `- 👍 Indexed ${colors.length} colors with settings:`,
    JSON.stringify(settings),
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

  await algolia.user.clearObjects();
  await algolia.user.saveObjects(users);

  const settings: Parameters<typeof algolia.user.setSettings>[0] = {
    searchableAttributes: ["displayName"],
    attributesForFaceting: ["groups", "isDisabled"],
  };

  await algolia.user.setSettings(settings);

  console.log(
    `- 👍 Indexed ${users.length} users with settings:`,
    JSON.stringify(settings),
  );
}

async function indexFosterFamilies() {
  const fosterFamilies = await prisma.fosterFamily.findMany({
    select: { id: true, displayName: true },
  });

  await algolia.fosterFamily.clearObjects();
  await algolia.fosterFamily.saveObjects(fosterFamilies);

  const settings: Parameters<typeof algolia.fosterFamily.setSettings>[0] = {
    searchableAttributes: ["displayName"],
  };

  await algolia.fosterFamily.setSettings(settings);

  console.log(
    `- 👍 Indexed ${fosterFamilies.length} foster families with settings:`,
    JSON.stringify(settings),
  );
}

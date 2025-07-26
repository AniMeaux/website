#!/usr/bin/env tsx

import "#env";
import { PrismaClient } from "@prisma/client";
import { csvFormat } from "d3-dsv";
import { DateTime, Settings } from "luxon";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConditionalKeys } from "type-fest";

// We're not supposed to have invalid date objects.
// Use null or undefined instead.
Settings.throwOnInvalid = true;
declare module "luxon" {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = dirname(FILENAME);
const DEST_FOLDER_NAME = DateTime.now().toISO();
const DEST_FOLDER_PATH = resolve(DIRNAME, "../../dumps/", DEST_FOLDER_NAME);
const RELATIVE_FOLDER_PATH = relative(process.cwd(), DEST_FOLDER_PATH);

console.log(`💾 Data will be downloaded in folder: ${RELATIVE_FOLDER_PATH}`);

// Ensure the destination directory exists.
await mkdir(DEST_FOLDER_PATH, { recursive: true });

type TableName = ConditionalKeys<
  PrismaClient,
  { findMany: () => Promise<object[]> }
>;

const prisma = new PrismaClient();

const DOWNLOADERS: Record<TableName, () => Promise<object[]>> = {
  animal: () => prisma.animal.findMany(),
  animalDraft: () => prisma.animalDraft.findMany(),
  breed: () => prisma.breed.findMany(),
  color: () => prisma.color.findMany(),
  event: () => prisma.event.findMany(),
  fosterFamily: () => prisma.fosterFamily.findMany(),
  password: () => prisma.password.findMany(),
  pressArticle: () => prisma.pressArticle.findMany(),
  showAnimation: () => prisma.showAnimation.findMany(),
  showExhibitor: () => prisma.showExhibitor.findMany(),
  showExhibitorApplication: () => prisma.showExhibitorApplication.findMany(),
  showExhibitorDog: () => prisma.showExhibitorDog.findMany(),
  showProvider: () => prisma.showProvider.findMany(),
  showSponsor: () => prisma.showSponsor.findMany(),
  user: () => prisma.user.findMany(),
};

try {
  const tablesPromise = Object.entries(DOWNLOADERS).map(
    async ([tableName, downloader]) => {
      const data = await downloader();
      await outputCsv(data, tableName, DEST_FOLDER_PATH);
    },
  );

  await Promise.all(tablesPromise);

  console.log(`🎉 Downloaded ${tablesPromise.length} tables(s)`);
} finally {
  await prisma.$disconnect();
}

async function outputCsv(
  data: object[],
  tableName: string,
  folderPath: string,
) {
  await writeFile(join(folderPath, `${tableName}.csv`), csvFormat(data));

  console.log(`- 👍 ${tableName}`);
}

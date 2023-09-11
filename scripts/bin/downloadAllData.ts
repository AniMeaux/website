#!/usr/bin/env ts-node

import "#env.ts";
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
  exhibitor: () => prisma.exhibitor.findMany(),
  fosterFamily: () => prisma.fosterFamily.findMany(),
  password: () => prisma.password.findMany(),
  pressArticle: () => prisma.pressArticle.findMany(),
  showEvent: () => prisma.showEvent.findMany(),
  user: () => prisma.user.findMany(),
};

downloadAllData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function downloadAllData() {
  const folderName = DateTime.now().toISO();
  const folderPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../dumps/",
    folderName,
  );
  const relativeFolderPath = relative(process.cwd(), folderPath);

  console.log(`💾 Data will be downloaded in folder: ${relativeFolderPath}`);

  await mkdir(folderPath, { recursive: true });

  const tablesPromise = Object.entries(DOWNLOADERS).map(
    async ([tableName, downloader]) => {
      const data = await downloader();
      await outputCsv(data, tableName, folderPath);
    },
  );

  await Promise.all(tablesPromise);

  console.log(`🎉 Downloaded ${tablesPromise.length} tables(s)`);
}

async function outputCsv(
  data: object[],
  tableName: string,
  folderPath: string,
) {
  await writeFile(join(folderPath, `${tableName}.csv`), csvFormat(data));

  console.log(`- 👍 ${tableName}`);
}

#!/usr/bin/env ts-node

import "#env.ts";
import { PrismaClient } from "@prisma/client";
import { csvFormat } from "d3-dsv";
import { DateTime } from "luxon";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "path";
import type { ConditionalKeys } from "type-fest";

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
  const folderPath = resolve(__dirname, "../../dumps/", folderName);
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

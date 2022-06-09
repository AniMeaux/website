import { PrismaClient } from "@prisma/client";
import { csvFormat } from "d3-dsv";
import { ensureDir, outputFile } from "fs-extra";
import { DateTime } from "luxon";
import path from "path";

const prisma = new PrismaClient();

const TABLES_NAMES = Object.keys(prisma).filter((key) => /^[^$_]/.test(key));

downloadAllData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function downloadAllData() {
  const folderName = DateTime.now().toISO();
  const folderPath = path.resolve(__dirname, "../dumps/", folderName);
  const relativeFolderPath = path.relative(process.cwd(), folderPath);

  console.log(`💾 Data will be downloaded in folder: ${relativeFolderPath}`);

  await ensureDir(folderPath);

  const tablesPromise = TABLES_NAMES.map((name) =>
    downloadTable(name, folderPath)
  );

  await Promise.all(tablesPromise);

  console.log(`🎉 Downloaded ${tablesPromise.length} tables(s)`);
}

async function downloadTable(name: string, folderPath: string) {
  const data = await (prisma as any)[name].findMany();
  await outputCsv(data, name, folderPath);
}

async function outputCsv(data: any[], tableName: string, folderPath: string) {
  await outputFile(path.join(folderPath, `${tableName}.csv`), csvFormat(data));
  console.log(`- 👍 ${tableName}`);
}

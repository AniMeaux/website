import * as admin from "firebase-admin";
import { ensureDir, outputFile } from "fs-extra";
import { DateTime } from "luxon";
import path from "path";
import { cleanUpFirebase, initializeFirebase } from "../src/core/firebase";
import { ANIMAL_COLLECTION } from "../src/entities/animal.entity";
import { ANIMAL_BREED_COLLECTION } from "../src/entities/animalBreed.entity";
import { ANIMAL_COLOR_COLLECTION } from "../src/entities/animalColor.entity";
import { EVENT_COLLECTION } from "../src/entities/event.entity";
import { HOST_FAMILY_COLLECTION } from "../src/entities/hostFamily.entity";
import { getAllUsers } from "../src/entities/user.entity";

const COLLECTIONS_NAME = [
  ANIMAL_BREED_COLLECTION,
  ANIMAL_COLOR_COLLECTION,
  ANIMAL_COLLECTION,
  HOST_FAMILY_COLLECTION,
  EVENT_COLLECTION,
];

initializeFirebase();

downloadAllData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => cleanUpFirebase());

async function downloadAllData() {
  const folderName = DateTime.now().toISO();
  const folderPath = path.resolve(__dirname, "../dumps/", folderName);
  const relativeFolderPath = path.relative(process.cwd(), folderPath);

  console.log(`💾 Data will be downloaded in folder: ${relativeFolderPath}`);

  await ensureDir(folderPath);

  const collectionsPromise = [downloadUsers(folderPath)].concat(
    COLLECTIONS_NAME.map((name) => downloadCollection(name, folderPath))
  );

  await Promise.all(collectionsPromise);

  console.log(`\n🎉 Downloaded ${collectionsPromise.length} collection(s)\n`);
}

async function downloadUsers(folderPath: string) {
  await outputCsv(await getAllUsers(), "users", folderPath);
}

async function downloadCollection(collectionName: string, folderPath: string) {
  const collection = await admin.firestore().collection(collectionName).get();
  const objects = collection.docs.map((doc) => doc.data());
  await outputCsv(objects, collectionName, folderPath);
}

async function outputCsv(
  objects: any[],
  collectionName: string,
  folderPath: string
) {
  await outputFile(
    path.join(folderPath, `${collectionName}.csv`),
    formatCsv(objects)
  );

  console.log(`- 👍 ${collectionName}`);
}

function formatCsv(objects: any[]) {
  const columns = inferColumns(objects);

  return [columns.map(formatValue).join(",")]
    .concat(preformatContent(objects, columns))
    .join("\n");
}

function inferColumns(objects: any[]): string[] {
  const columns = new Set<string>();

  objects.forEach((object) => {
    Object.keys(object).forEach((key) => columns.add(key));
  });

  return Array.from(columns);
}

function preformatContent(objects: any[], columns: string[]) {
  return objects.map((object) =>
    columns.map((column) => formatValue(object[column])).join(",")
  );
}

function formatValue(value: any) {
  if (value == null) {
    return "";
  }

  const valueStr = String(value);

  if (/[",\n\r]/.test(valueStr)) {
    return `"${valueStr.replace(/"/g, '""')}"`;
  }

  return valueStr;
}

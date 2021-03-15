import "./shared";
import { csvFormat } from "d3-dsv";
import { format } from "date-fns";
import * as admin from "firebase-admin";
import { ensureDir, outputFile } from "fs-extra";
import path from "path";
import { firebaseDatabase } from "../src/database/implementations/firebase";

function relativePath(absolutePath: string) {
  return path.relative(process.cwd(), absolutePath);
}

const COLLECTIONS_NAME = ["animalBreeds", "animals", "hostFamilies"];

async function outputRows(
  rows: any[],
  collectionName: string,
  folderPath: string
) {
  const csv = csvFormat(rows);
  await outputFile(path.join(folderPath, `${collectionName}.csv`), csv);

  console.log(`- 👍 ${collectionName}`);
}

async function downloadCollection(collectionName: string, folderPath: string) {
  const collection = await admin.firestore().collection(collectionName).get();
  const rows = collection.docs.map((doc) => doc.data());
  await outputRows(rows, collectionName, folderPath);
}

async function downloadUsers(folderPath: string) {
  const users = await firebaseDatabase.getAllUsers();
  await outputRows(users, "users", folderPath);
}

async function downloadAllData() {
  firebaseDatabase.initialize();

  const folderName = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const folderPath = path.resolve(__dirname, "../dumps/", folderName);
  const relativeFolderPath = relativePath(folderPath);

  console.log(`💾 Data will be downloaded in folder: ${relativeFolderPath}`);

  await ensureDir(folderPath);

  const collectionsPromise = [downloadUsers(folderPath)].concat(
    COLLECTIONS_NAME.map((name) => downloadCollection(name, folderPath))
  );

  await Promise.all(collectionsPromise);

  console.log(`\n🎉 Downloaded ${collectionsPromise.length} collection(s)\n`);

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

downloadAllData();

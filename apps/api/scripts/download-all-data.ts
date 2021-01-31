import { csvFormat } from "d3-dsv";
import { format } from "date-fns";
import * as admin from "firebase-admin";
import { ensureDir, outputFile } from "fs-extra";
import path from "path";
import "./shared";

function initializeFirebase() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
}

function relativePath(absolutePath: string) {
  return path.relative(process.cwd(), absolutePath);
}

const COLLECTIONS_NAME = ["animalBreeds", "users", "hostFamilies"];

async function downloadCollection(collectionName: string, folderPath: string) {
  const collection = await admin.firestore().collection(collectionName).get();
  const rows = collection.docs.map((doc) => doc.data());
  const csv = csvFormat(rows);
  await outputFile(path.join(folderPath, `${collectionName}.csv`), csv);

  console.log(`- 👍 ${collectionName}`);
}

async function downloadAllData() {
  initializeFirebase();

  const folderName = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const folderPath = path.resolve(__dirname, "../dumps/", folderName);
  const relativeFolderPath = relativePath(folderPath);

  console.log(`Data will be downloaded in folder: ${relativeFolderPath}`);

  await ensureDir(folderPath);

  await Promise.all(
    COLLECTIONS_NAME.map((name) => downloadCollection(name, folderPath))
  );

  console.log(`\n🎉 Downloaded ${COLLECTIONS_NAME.length} collection(s)\n`);
}

downloadAllData();

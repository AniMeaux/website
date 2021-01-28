import * as admin from "firebase-admin";
import { Database, DatabaseCore } from "../../databaseType";
import { animalBreedDatabase } from "./animalBreed";
import { hostFamilyDatabase } from "./hostFamily";
import { userDatabase } from "./user";

const databaseCore: DatabaseCore = {
  initialize() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // https://stackoverflow.com/a/41044630/1332513
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }
  },
};

export const firebaseDatabase: Database = {
  ...databaseCore,
  ...animalBreedDatabase,
  ...hostFamilyDatabase,
  ...userDatabase,
};

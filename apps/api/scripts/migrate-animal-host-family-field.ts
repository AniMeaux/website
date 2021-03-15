import "./shared";
import { DBAnimal } from "@animeaux/shared-entities";
import * as admin from "firebase-admin";
import { firebaseDatabase } from "../src/database/implementations/firebase";
import { AlgoliaClient } from "../src/database/implementations/firebase/algoliaClient";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

async function migrateAnimal(animal: DBAnimal) {
  if (animal.hostFamilyId != null) {
    await AnimalsIndex.partialUpdateObject({
      objectID: animal.id,
      hostFamilyId: animal.hostFamilyId,
    });

    console.log(`- 👍 ${animal.officialName} (${animal.id})`);
    return true;
  }

  return false;
}

function hasMigrated(value: boolean): value is true {
  return value;
}

async function main() {
  firebaseDatabase.initialize();
  console.log(`🚚 Migrating animals:`);

  const collection = await admin.firestore().collection("animals").get();
  const animals = collection.docs.map((doc) => doc.data() as DBAnimal);

  const migratedAnimals = (
    await Promise.all(animals.map(migrateAnimal))
  ).filter(hasMigrated);

  console.log(`\n🎉 Migrated ${migratedAnimals.length} animals!\n`);

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

main();

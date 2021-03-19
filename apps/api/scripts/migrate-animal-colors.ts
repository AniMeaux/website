import "./shared";
import { AnimalColorIds, DBAnimal } from "@animeaux/shared-entities";
import * as admin from "firebase-admin";
import { firebaseDatabase } from "../src/database/implementations/firebase";
import { AlgoliaClient } from "../src/database/implementations/firebase/algoliaClient";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

async function migrateAnimal(animal: DBAnimal) {
  if (animal.color != null) {
    const { color, ...cleanedAnimal } = animal;
    cleanedAnimal.colorId =
      cleanedAnimal.colorId ?? AnimalColorIds[animal.color];

    await admin
      .firestore()
      .collection("animals")
      .doc(animal.id)
      .set(cleanedAnimal);

    const {
      description,
      picturesId,
      comments,
      ...searchableAnimal
    } = cleanedAnimal;

    await AnimalsIndex.saveObject({ ...searchableAnimal, objectID: animal.id });

    console.log(
      `- 👍 ${animal.officialName} ${color} → ${cleanedAnimal.colorId}`
    );
    return true;
  }

  return false;
}

function hasMigrated(value: boolean): value is true {
  return value;
}

async function main() {
  firebaseDatabase.initialize();
  console.log(`🚚 Migrating animal colors:`);

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

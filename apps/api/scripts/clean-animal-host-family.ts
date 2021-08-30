import "./shared";
import { AnimalStatus, DBAnimal } from "@animeaux/shared-entities";
import * as admin from "firebase-admin";
import { firebaseDatabase } from "../src/database/implementations/firebase";
import { AlgoliaClient } from "../src/database/implementations/firebase/algoliaClient";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

async function cleanAnimalHostFamily() {
  firebaseDatabase.initialize();

  const snapshot = await admin
    .firestore()
    .collection("animals")
    .where("status", "in", [
      AnimalStatus.ADOPTED,
      AnimalStatus.DECEASED,
      AnimalStatus.FREE,
    ])
    .get();

  const animalToClean = snapshot.docs
    .map((doc) => doc.data() as DBAnimal)
    .filter((animal) => animal.hostFamilyId != null);

  console.log(`🧹 Removing host family for ${animalToClean.length} animal(s)`);

  await AnimalsIndex.partialUpdateObjects(
    animalToClean.map((animal) => ({ objectID: animal.id, hostFamilyId: null }))
  );

  await Promise.all(
    animalToClean.map((animal) =>
      admin.firestore().collection("animals").doc(animal.id).update({
        hostFamilyId: null,
      })
    )
  );

  console.log(`🎉 Cleaned ${animalToClean.length} animal(s)`);

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

cleanAnimalHostFamily();

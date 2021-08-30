import "./shared";
import { DBAnimal, PickUpReason } from "@animeaux/shared-entities";
import * as admin from "firebase-admin";
import { firebaseDatabase } from "../src/database/implementations/firebase";
import { AlgoliaClient } from "../src/database/implementations/firebase/algoliaClient";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

async function addDefaultPickUpReason() {
  firebaseDatabase.initialize();
  const collection = await admin.firestore().collection("animals").get();
  const allAnimals = collection.docs.map((doc) => doc.data() as DBAnimal);

  console.log(
    `💿 Adding default pick up reason (${PickUpReason.OTHER}) to ${allAnimals.length} animal(s)`
  );

  await AnimalsIndex.partialUpdateObjects(
    allAnimals.map((animal) => ({
      objectID: animal.id,
      pickUpReason: PickUpReason.OTHER,
    }))
  );

  await Promise.all(
    allAnimals.map((animal) =>
      admin.firestore().collection("animals").doc(animal.id).update({
        pickUpReason: PickUpReason.OTHER,
      })
    )
  );

  console.log(`🎉 ${allAnimals.length} animal(s) updated`);

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

addDefaultPickUpReason();

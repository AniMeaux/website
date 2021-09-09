import "./shared";
import {
  AnimalStatus,
  DBAnimal,
  DBSearchableAnimal,
} from "@animeaux/shared-entities";
import { csvParse, DSVRowString } from "d3-dsv";
import * as admin from "firebase-admin";
import { readFile } from "fs-extra";
import { firebaseDatabase } from "../src/database/implementations/firebase";
import { AlgoliaClient } from "../src/database/implementations/firebase/algoliaClient";

const AnimalsIndex = AlgoliaClient.initIndex("animals");

function mapAnimalRow(row: DSVRowString<keyof DBAnimal>, rowIndex: number) {
  if (row.id == null || row.adoptionDate == null) {
    throw new Error(`Row ${rowIndex} is not a valid animal`);
  }

  return { id: row.id, adoptionDate: row.adoptionDate };
}

async function uploadAnimalAdoptionDate() {
  const csvPath = process.argv[2];

  if (csvPath == null) {
    console.error("CSV file missing.");
    process.exit(1);
  }

  const csv = await readFile(csvPath, { encoding: "utf-8" });
  const rows = csvParse<keyof DBAnimal>(csv);
  const animalsPayload = Object.fromEntries(
    rows
      .filter((animal) => animal.status === AnimalStatus.ADOPTED)
      .map(mapAnimalRow)
      .map<[string, Partial<DBSearchableAnimal>]>((animal) => [
        animal.id,
        {
          adoptionDate: animal.adoptionDate,
          adoptionDateTimestamp: new Date(animal.adoptionDate).getTime(),
        },
      ])
  );

  firebaseDatabase.initialize();
  const collection = await admin.firestore().collection("animals").get();
  const animalsToUpdate = collection.docs
    .map((doc) => doc.data() as DBAnimal)
    .filter(
      (animal) =>
        animal.status === AnimalStatus.ADOPTED && animal.adoptionDate == null
    );

  console.log(`📆 Adding adoption date to ${animalsToUpdate.length} animal(s)`);

  await AnimalsIndex.partialUpdateObjects(
    animalsToUpdate.map((animal) => ({
      objectID: animal.id,
      ...animalsPayload[animal.id],
    }))
  );

  await Promise.all(
    animalsToUpdate.map((animal) =>
      admin
        .firestore()
        .collection("animals")
        .doc(animal.id)
        .update(animalsPayload[animal.id])
    )
  );

  console.log(`🎉 ${animalsToUpdate.length} animal(s) updated`);

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

uploadAnimalAdoptionDate();

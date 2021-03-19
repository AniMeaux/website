import "./shared";
import {
  AnimalColorEnum,
  AnimalColorLabels,
  ANIMAL_COLORS_ORDER,
} from "@animeaux/shared-entities";
import { firebaseDatabase } from "../src/database/implementations/firebase";
import { animalColorDatabase } from "../src/database/implementations/firebase/animalColor";

async function createAnimalColor(color: AnimalColorEnum) {
  const animalColor = await animalColorDatabase.createAnimalColor({
    name: AnimalColorLabels[color],
  });

  console.log(`- 👍 ${animalColor.name} (${animalColor.id})`);
}

async function main() {
  firebaseDatabase.initialize();
  console.log(`🚚 Migrating animal colors:`);

  await Promise.all(ANIMAL_COLORS_ORDER.map(createAnimalColor));

  console.log(`\n🎉 Migrated ${ANIMAL_COLORS_ORDER.length} colors!\n`);

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

main();

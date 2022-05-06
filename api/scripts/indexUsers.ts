import { cleanUpFirebase, initializeFirebase } from "../src/core/firebase";
import {
  getAllUsers,
  UserFromAlgolia,
  UserIndex,
} from "../src/entities/user.entity";

initializeFirebase();

indexUsers()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => cleanUpFirebase());

async function indexUsers() {
  console.log("📇 Indexing users...");

  const users = await getAllUsers();

  await UserIndex.clearObjects();

  await UserIndex.saveObjects(
    users.map((user) => {
      const userFromAlgolia: UserFromAlgolia = {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        disabled: user.disabled,
        groups: user.groups,
      };

      return {
        ...userFromAlgolia,
        objectID: userFromAlgolia.id,
      };
    })
  );

  console.log(`\n🎉 Indexed ${users.length} user(s)\n`);
}

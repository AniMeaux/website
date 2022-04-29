import { initializeFirebase } from "../src/core/firebase";
import {
  getAllUsers,
  UserFromAlgolia,
  UserIndex,
} from "../src/entities/user.entity";

process.on("unhandledRejection", (err) => {
  throw err;
});

indexUsers();

async function indexUsers() {
  initializeFirebase();

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

  // Firebase has an open handle (setTokenRefreshTimeout) that prevent the
  // script from exiting, so we force exit.
  process.exit(0);
}

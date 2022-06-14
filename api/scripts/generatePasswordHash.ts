import invariant from "tiny-invariant";
import { generatePasswordHash } from "../src/core/password";

generatePasswordHashMain().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generatePasswordHashMain() {
  const password = process.argv[2];
  invariant(password != null, "Missing password in command line.");

  const hash = await generatePasswordHash(password);
  console.log("Hash for password:", hash);
}

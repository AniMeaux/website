import "./env";
import { Server } from "./server";

// See `ProcessEnv` in global.d.ts.
const missingEnvVariables = [
  "NODE_ENV",
  "PORT",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_DATABASE_URL",
  "FIREBASE_PRIVATE_KEY",
  "ALGOLIA_ID",
  "ALGOLIA_ADMIN_KEY",
].filter((value) => process.env[value] == null);

if (missingEnvVariables.length > 0) {
  throw new Error(
    [
      `Missing environment variables: ${missingEnvVariables.join(", ")}.`,
      "Please check they are correctly defined in the .env* files.",
    ].join("\n")
  );
}

async function main() {
  Server.start();
}

main();

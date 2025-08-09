#!/usr/bin/env tsx

import pg from "pg";
import { from, to } from "pg-copy-streams";
import invariant from "tiny-invariant";

// pg package doesn't support ESM yet.
const { Client } = pg;

// Order: last table is copied first.
const TABLES_NAME = [
  "Activity",
  "Animal",
  "Breed",
  "Color",
  "Event",
  "FosterFamily",
  "Password",
  "PressArticle",
  "ShowAnimation",
  "ShowExhibitorDog",
  "ShowPartner",
  "ShowProvider",
  "ShowExhibitor",
  "ShowExhibitorApplication",
  "ShowStandSizeLimit",
  "User",
];

const [, , source, destination] = process.argv;
invariant(source, "source parameter should be defined");
invariant(destination, "destination parameter should be defined");
invariant(source !== destination, "source and destination should not be equal");

const sourceHost = source.replace(/^.*@/, "");
const destinationHost = destination.replace(/^.*@/, "");

console.log(`🚚 Copying data: ${sourceHost} 👉 ${destinationHost}`);

const sourceClient = new Client({ connectionString: source });
const destinationClient = new Client({ connectionString: destination });

try {
  await sourceClient.connect();
  await destinationClient.connect();

  await clearDestination();
  await copyTables();
} finally {
  await Promise.allSettled([sourceClient.end(), destinationClient.end()]);
}

console.log(`🎉 Copied ${TABLES_NAME.length} tables(s)`);

async function clearDestination() {
  console.log("[1/2] 🗑 Removing all data from destination...");

  // This needs to be done in sequence.
  for (const tableName of TABLES_NAME) {
    await destinationClient.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
    console.log(`- 👍 ${tableName}`);
  }
}

async function copyTables() {
  console.log("[2/2] 🚚 Copying all tables...");

  const tablesName = [...TABLES_NAME].reverse();

  // This needs to be done in sequence.
  for (const tableName of tablesName) {
    await new Promise((resolve, reject) => {
      const sourceStream = sourceClient.query(
        to(`COPY "${tableName}" TO STDOUT CSV HEADER`),
      );

      const destinationStream = destinationClient.query(
        from(`COPY "${tableName}" FROM STDIN CSV HEADER`),
      );

      destinationStream.on("finish", resolve);
      destinationStream.on("error", reject);
      sourceStream.on("error", reject);
      sourceStream.pipe(destinationStream);
    });

    console.log(`- 👍 ${tableName}`);
  }
}

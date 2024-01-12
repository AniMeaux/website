#!/usr/bin/env ts-node

import pg from "pg";
import { from, to } from "pg-copy-streams";
import invariant from "tiny-invariant";

const { Client } = pg;

const TABLES_NAME = [
  "Animal",
  "Breed",
  "Color",
  "Event",
  "PressArticle",
  "FosterFamily",
  "Password",
  "User",
  "Exhibitor",
  "ShowEvent",
  "ShowPartner",
];

const [, , source, destination] = process.argv;
invariant(source, "source parameter should be defined");
invariant(destination, "destination parameter should be defined");
invariant(source !== destination, "source and destination should not be equal");

const sourceHost = source.replace(/^.*@/, "");
const destinationHost = destination.replace(/^.*@/, "");

const sourceClient = new Client({ connectionString: source });
const destinationClient = new Client({ connectionString: destination });

copyData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    return await Promise.allSettled([
      sourceClient.end(),
      destinationClient.end(),
    ]);
  });

async function copyData() {
  console.log(`🚚 Copying data: ${sourceHost} 👉 ${destinationHost}`);
  await sourceClient.connect();
  await destinationClient.connect();

  await clearDestination();
  await copyTables();

  console.log(`🎉 Copied ${TABLES_NAME.length} tables(s)`);
}

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

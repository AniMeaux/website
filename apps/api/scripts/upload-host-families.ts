import "./shared";
import { CreateHostFamilyPayload } from "@animeaux/shared-entities";
import { csvParse, DSVRowString } from "d3-dsv";
import { readFile } from "fs-extra";
import { firebaseDatabase } from "../src/database/implementations/firebase";

async function uploadHostFamily(hostFamilyPayload: CreateHostFamilyPayload) {
  const hostFamily = await firebaseDatabase.createHostFamily(hostFamilyPayload);
  console.log(`- 👍 ${hostFamily.name} (${hostFamily.id})`);
}

function toHostFamilyPayload(
  row: DSVRowString<keyof CreateHostFamilyPayload>,
  rowIndex: number
): CreateHostFamilyPayload {
  if (
    row.name == null ||
    row.phone == null ||
    row.email == null ||
    row.zipCode == null ||
    row.city == null ||
    row.address == null
  ) {
    throw new Error(`Row ${rowIndex} is not a valid HostFamily`);
  }

  return {
    name: row.name,
    phone: row.phone,
    email: row.email,
    zipCode: row.zipCode,
    city: row.city,
    address: row.address,
  };
}

async function uploadHostFamilies() {
  const csvPath = process.argv[2];

  if (csvPath == null) {
    console.error("CSV file missing.");
    process.exit(1);
  }

  const csv = await readFile(csvPath, { encoding: "utf-8" });
  const rows = csvParse<keyof CreateHostFamilyPayload>(csv);
  const hostFamiliesPayload = rows.map(toHostFamilyPayload);

  console.log(`☁️  Uploading ${hostFamiliesPayload.length} Host Families.`);

  firebaseDatabase.initialize();
  await Promise.all(hostFamiliesPayload.map(uploadHostFamily));

  console.log("\n🎉 Upload succeeded\n");
}

uploadHostFamilies();

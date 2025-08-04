import { notFound } from "#core/response.server";
import { services } from "#core/services.server.js";
import { json } from "@remix-run/node";

export async function loader() {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  const files = await services.fileStorage.getFiles(
    process.env.GOOGLE_DRIVE_APPLICATION_FOLDER_ID,
  );

  return json({ files });
}

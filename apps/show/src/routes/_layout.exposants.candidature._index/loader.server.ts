import { notFound } from "#core/response.server";
import { services } from "#core/services.server.js";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { getStandSizesData } from "./stand-sizes.server";

export async function loader() {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  const { files, standSizes } = await promiseHash({
    files: services.fileStorage.getFiles(
      process.env.GOOGLE_DRIVE_APPLICATION_FOLDER_ID,
    ),

    standSizes: getStandSizesData(),
  });

  return json({
    files,
    standSizes,
    availableStandSizes: standSizes.filter(
      (standSize) => standSize.isAvailable,
    ),
  });
}

import { services } from "#core/services.server.js";
import { json } from "@remix-run/node";
import { QUESTIONS } from "./questions.server";

export async function loader() {
  const files = await services.fileStorage.getFiles(
    process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID,
  );

  return json({ questions: QUESTIONS, files });
}

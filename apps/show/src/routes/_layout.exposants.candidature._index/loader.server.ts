import { notFound } from "#core/response.server";
import { json } from "@remix-run/node";

export async function loader() {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  return json("ok" as const);
}

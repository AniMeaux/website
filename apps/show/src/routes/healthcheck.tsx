// learn more: https://fly.io/docs/reference/configuration/#services-http_checks

import { prisma } from "#core/prisma.server";

export async function loader() {
  try {
    // We're good if we can connect to the database and make a simple query.
    await prisma.exhibitor.count();

    return new Response("OK");
  } catch (error) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}

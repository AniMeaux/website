import { prisma } from "#core/db.server.ts";

// Learn more: https://fly.io/docs/reference/configuration/#services-http_checks
export async function loader() {
  try {
    // We're good if we can connect to the database and make a simple query.
    await prisma.user.count();

    return new Response("OK");
  } catch (error) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}

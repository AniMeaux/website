// learn more: https://fly.io/docs/reference/configuration/#services-http_checks

import { services } from "#core/services.server.js";

export async function loader() {
  try {
    // We're good if we can connect to the database and make a simple query.
    await services.prisma.user.count();

    return new Response("OK");
  } catch (error) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}

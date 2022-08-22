// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import { LoaderFunction } from "@remix-run/node";
import { createConfig } from "~/core/config.server";

export const loader: LoaderFunction = async () => {
  const config = createConfig();

  try {
    // We're good if we can:
    await Promise.all([
      // 1. Make a HEAD request to ourselves
      fetch(config.publicHost, { method: "HEAD" }).then((response) => {
        if (!response.ok) {
          return Promise.reject(response);
        }
      }),
    ]);

    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};

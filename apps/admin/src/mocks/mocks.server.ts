import { setupServer } from "msw/node";
import { algoliaHandlers } from "~/mocks/algolia/algolia.server";
import { cloudinaryHandlers } from "~/mocks/cloudinary/cloudinary.server";

const server = setupServer(...algoliaHandlers, ...cloudinaryHandlers);

export function startWorker() {
  server.listen({ onUnhandledRequest: "bypass" });
  console.info("🔶 Mock server running");
  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());
}

import { setupServer } from "msw/node";

import { cloudinaryHandlers } from "#i/mocks/cloudinary/cloudinary.server";

const server = setupServer(...cloudinaryHandlers);

export function startWorker() {
  server.listen({ onUnhandledRequest: "bypass" });
  console.info("🔶 Mock server running");
  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());
}

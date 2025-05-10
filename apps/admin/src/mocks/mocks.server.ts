import { cloudinaryHandlers } from "#mocks/cloudinary/cloudinary.server";
import { setupServer } from "msw/node";

const server = setupServer(...cloudinaryHandlers);

export function startWorker() {
  server.listen({ onUnhandledRequest: "bypass" });
  console.info("🔶 Mock server running");
  process.once("SIGINT", () => server.close());
  process.once("SIGTERM", () => server.close());
}

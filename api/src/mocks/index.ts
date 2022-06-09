import { setupServer } from "msw/node";
import { algoliaHandlers } from "./algolia";

const server = setupServer(...algoliaHandlers);

server.listen({ onUnhandledRequest: "warn" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());

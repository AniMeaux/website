import { cloudinaryHandlers } from "#mocks/cloudinary.client";
import { setupWorker } from "msw/browser";

const worker = setupWorker(...cloudinaryHandlers);

export function startWorker() {
  worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
    serviceWorker: {
      url: "/mock-service-worker.js",
    },
  });
}

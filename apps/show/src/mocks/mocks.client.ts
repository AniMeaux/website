import { cloudinaryHandlers } from "#mocks/cloudinary.client";
import { setupWorker } from "msw";

const worker = setupWorker(...cloudinaryHandlers);

export function startWorker() {
  worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}

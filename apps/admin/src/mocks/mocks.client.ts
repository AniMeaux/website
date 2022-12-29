import { setupWorker } from "msw";
import { cloudinaryHandlers } from "~/mocks/cloudinary/cloudinary.client";

const worker = setupWorker(...cloudinaryHandlers);

export function startWorker() {
  worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}

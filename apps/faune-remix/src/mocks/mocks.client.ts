import { setupWorker } from "msw";
import { cloudinaryHandlers } from "./cloudinary";

const worker = setupWorker(...cloudinaryHandlers);

export function startWorker() {
  worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}

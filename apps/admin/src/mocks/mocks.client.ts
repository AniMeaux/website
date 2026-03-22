import { setupWorker } from "msw/browser"

import { cloudinaryHandlers } from "#i/mocks/cloudinary/cloudinary.client"

const worker = setupWorker(...cloudinaryHandlers)

export async function startWorker() {
  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
    serviceWorker: {
      url: "/mock-service-worker.js",
    },
  })
}

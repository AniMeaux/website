import { LazyFile } from "@mjackson/lazy-file"

import type { ServiceImage } from "#i/core/image/service.server.js"

export class ServiceImageMock implements ServiceImage {
  createReversibleUpload() {
    const upload: ServiceImage.Uploader = async (fileUpload, params) => {
      return new LazyFile(
        {
          byteLength: fileUpload.size,
          stream: () => {
            throw new Error("Not supported")
          },
        },
        params.imageId,
        { type: fileUpload.type },
      )
    }

    const revert: ServiceImage.Reverter = async () => {
      return undefined
    }

    return { upload, revert }
  }

  async getAllImages() {
    return Array.from({ length: 200 }).map<ServiceImage.Image>(() => ({
      id: crypto.randomUUID(),
      width: 8000,
      height: 8000,
    }))
  }

  async setBlurhash() {}
}

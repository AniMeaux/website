import { zu } from "@animeaux/zod-utils"

import { createLocationState } from "#i/core/location-state.js"

export const PicturesLocationState = createLocationState(
  zu
    .object({
      galleryLocationKey: zu.string().optional().catch(undefined),
    })
    .catch({}),
)

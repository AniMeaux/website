import { zu } from "@animeaux/zod-utils"

import { createLocationState } from "#i/core/location-state"

export const ScrollRestorationLocationState = createLocationState(
  zu
    .object({
      scrollRestorationLocationKey: zu.string().optional().catch(undefined),
    })
    .catch({}),
)

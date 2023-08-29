import { createLocationState } from "#core/locationState.ts";
import { z } from "zod";

export const PhotoLocationState = createLocationState(
  z
    .object({
      galleryLocationKey: z.string().optional().catch(undefined),
    })
    .catch({}),
);

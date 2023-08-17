import { z } from "zod";
import { createLocationState } from "~/core/locationState";

export const PhotoLocationState = createLocationState(
  z
    .object({
      galleryLocationKey: z.string().optional().catch(undefined),
    })
    .catch({})
);

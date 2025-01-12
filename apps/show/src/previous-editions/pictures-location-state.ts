import { createLocationState } from "#core/location-state";
import { zu } from "@animeaux/zod-utils";

export const PicturesLocationState = createLocationState(
  zu
    .object({
      galleryLocationKey: zu.string().optional().catch(undefined),
    })
    .catch({}),
);

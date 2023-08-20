import { createLocationState } from "#core/locationState.ts";
import { z } from "zod";

export const ScrollRestorationLocationState = createLocationState(
  z
    .object({
      scrollRestorationLocationKey: z.string().optional().catch(undefined),
    })
    .catch({})
);

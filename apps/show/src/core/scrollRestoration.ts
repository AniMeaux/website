import { z } from "zod";
import { createLocationState } from "~/core/locationState";

export const ScrollRestorationLocationState = createLocationState(
  z
    .object({
      scrollRestorationLocationKey: z.string().optional().catch(undefined),
    })
    .catch({})
);

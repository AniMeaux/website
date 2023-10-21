import { createLocationState } from "#core/locationState.ts";
import { zu } from "@animeaux/zod-utils";

export const ScrollRestorationLocationState = createLocationState(
  zu
    .object({
      scrollRestorationLocationKey: zu.string().optional().catch(undefined),
    })
    .catch({}),
);

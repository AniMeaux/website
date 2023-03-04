import { useLocation } from "@remix-run/react";
import { useMemo } from "react";
import { z } from "zod";

const LocationStateSchema = z
  .object({ fromApp: z.boolean().catch(false) })
  .catch({ fromApp: false });

export function useLocationState() {
  const location = useLocation();

  return useMemo(
    () => LocationStateSchema.parse(location.state),
    [location.state]
  );
}

// TODO: Replace this function by `satisfies` operator once Remix is updated.
export function createLocationState(
  state: z.infer<typeof LocationStateSchema>
) {
  return state;
}

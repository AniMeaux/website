import { useLocation } from "@remix-run/react";
import { useMemo } from "react";
import { z } from "zod";

const LocationStateSchema = z
  .object({ fromApp: z.boolean().catch(false) })
  .catch({ fromApp: false });

export type LocationState = z.infer<typeof LocationStateSchema>;

export function useLocationState() {
  const location = useLocation();

  return useMemo(
    () => LocationStateSchema.parse(location.state),
    [location.state],
  );
}

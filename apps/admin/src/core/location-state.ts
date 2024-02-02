import { zu } from "@animeaux/zod-utils";
import { useLocation } from "@remix-run/react";
import { useMemo } from "react";

const LocationStateSchema = zu
  .object({ fromApp: zu.boolean().catch(false) })
  .catch({ fromApp: false });

export type LocationState = zu.infer<typeof LocationStateSchema>;

export function useLocationState() {
  const location = useLocation();

  return useMemo(
    () => LocationStateSchema.parse(location.state),
    [location.state],
  );
}

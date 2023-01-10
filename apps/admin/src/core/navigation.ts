import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

const StateSchema = z.object({
  // Used by history package internally to track navigation.
  // https://github.com/remix-run/history/blob/3e9dab413f4eda8d6bce565388c5ddb7aeff9f7e/packages/history/index.ts#L348
  idx: z.number().min(0).default(0),
});

export function useBackIfPossible({
  fallbackRedirectTo,
}: {
  fallbackRedirectTo?: string;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (fallbackRedirectTo != null) {
      const state = parseOrDefault(StateSchema, window.history.state ?? {});
      if (state.idx === 0) {
        navigate(fallbackRedirectTo);
      } else {
        navigate(-1);
      }
    }
  }, [navigate, fallbackRedirectTo]);
}

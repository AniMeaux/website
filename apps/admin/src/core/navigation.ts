import {
  NavigateFunction,
  useNavigate as useBaseNavigate,
} from "@remix-run/react";
import { useCallback, useEffect } from "react";
import { NavigateOptions, To } from "react-router";
import { createLocationState, useLocationState } from "~/core/locationState";

export function useBackIfPossible({
  fallbackRedirectTo,
}: {
  fallbackRedirectTo?: string;
}) {
  const { fromApp } = useLocationState();
  const navigate = useNavigate();

  useEffect(() => {
    if (fallbackRedirectTo != null) {
      if (fromApp) {
        navigate(-1);
      } else {
        navigate(fallbackRedirectTo);
      }
    }
  }, [fallbackRedirectTo, navigate, fromApp]);
}

export function useNavigate() {
  const { fromApp } = useLocationState();
  const navigate = useBaseNavigate();

  return useCallback<NavigateFunction>(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        return navigate(to);
      }

      return navigate(to, {
        ...options,
        state: createLocationState({ fromApp: !options?.replace || fromApp }),
      });
    },
    [navigate, fromApp]
  );
}

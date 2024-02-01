import type { Entity } from "#routes/resources.global-search/shared";
import { useMatches } from "@remix-run/react";

export type RouteHandle = {
  htmlBackgroundColor?: string;
  isFullHeight?: boolean;
  globalSearchEntity?: Entity;
};

export function useRouteHandles() {
  const matches = useMatches();
  return matches.map((match) => asRouteHandle(match.handle));
}

function asRouteHandle(handle: unknown): RouteHandle {
  if (handle == null) {
    return {};
  }

  return handle as RouteHandle;
}

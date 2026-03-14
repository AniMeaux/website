import { useMatches } from "@remix-run/react";

import type { Entity } from "#i/routes/resources.global-search/entity.js";

export type RouteHandle = {
  htmlBackgroundColor?: string;
  isFullHeight?: boolean;
  globalSearchEntity?: Entity.Enum;
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

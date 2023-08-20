import { RouteMatch } from "@remix-run/react";

export type RouteHandle = {
  hasExpandedPageBackground?: boolean;
  htmlBackgroundColor?: string;
  isFullHeight?: boolean;
};

export function asRouteHandle(handle: RouteMatch["handle"]): RouteHandle {
  if (handle == null) {
    return {};
  }

  return handle as RouteHandle;
}

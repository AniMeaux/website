import { RouteMatch } from "@remix-run/react";

export type RouteHandle = {
  htmlBackgroundColor?: string;
};

export function asRouteHandle(handle: RouteMatch["handle"]): RouteHandle {
  if (handle == null) {
    return {};
  }

  return handle as RouteHandle;
}

export type RouteHandle = {
  htmlBackgroundColor?: string;
  isFullHeight?: boolean;
};

export function asRouteHandle(handle: unknown): RouteHandle {
  if (handle == null) {
    return {};
  }

  return handle as RouteHandle;
}

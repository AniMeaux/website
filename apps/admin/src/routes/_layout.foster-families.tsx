import type { RouteHandle } from "#core/handles";
import { Entity } from "#routes/resources.global-search/shared";
import { Outlet } from "@remix-run/react";

export const handle: RouteHandle = {
  globalSearchEntity: Entity.FOSTER_FAMILY,
};

export default function Route() {
  return <Outlet />;
}

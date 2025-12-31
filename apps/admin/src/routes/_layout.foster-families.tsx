import type { RouteHandle } from "#i/core/handles";
import { Entity } from "#i/routes/resources.global-search/entity.js";
import { Outlet } from "@remix-run/react";

export const handle: RouteHandle = {
  globalSearchEntity: Entity.Enum.FOSTER_FAMILY,
};

export default function Route() {
  return <Outlet />;
}

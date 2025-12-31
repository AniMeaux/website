import { services } from "#i/core/services.server.js";
import { RouteParamsSchema } from "#i/exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { SectionTabs } from "./section-tabs";
import { SectionTitle } from "./section-title";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { name: true, token: true },
  });

  return { exhibitor };
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionTabs />
      <Outlet />
    </>
  );
}

import { services } from "#core/services/services.server";
import { RouteParamsSchema } from "#exhibitors/route-params";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { SectionTabs } from "./section-tabs";
import { SectionTitle } from "./section-title";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = RouteParamsSchema.parse(params);

  const profile = await services.exhibitor.profile.getByToken(
    routeParams.token,
    { select: { name: true } },
  );

  return { token: routeParams.token, profile };
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

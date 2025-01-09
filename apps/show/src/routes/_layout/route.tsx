import { asRouteHandle } from "#core/handles";
import { PageBackground } from "#core/layout/page-background";
import { services } from "#core/services/services.server";
import { json } from "@remix-run/node";
import { Outlet, useMatches } from "@remix-run/react";
import { LayoutFooter } from "./footer";
import { LayoutHeader } from "./header";

export async function loader() {
  if (
    process.env.FEATURE_FLAG_SITE_ONLINE !== "true" ||
    process.env.FEATURE_FLAG_SHOW_PARTNERS !== "true"
  ) {
    return json({ partners: [] });
  }

  const partners = await services.partner.getManyVisible();

  return json({ partners });
}

export default function Route() {
  const matches = useMatches();
  const routeHandles = matches.map((match) => asRouteHandle(match.handle));

  const hasExpandedPageBackground = routeHandles.some(
    (handle) => handle.hasExpandedPageBackground,
  );

  return (
    <>
      <PageBackground isExpanded={hasExpandedPageBackground} />

      <LayoutHeader />
      <Outlet />
      <LayoutFooter />
    </>
  );
}

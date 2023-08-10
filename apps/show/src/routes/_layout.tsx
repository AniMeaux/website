import { Outlet, useMatches } from "@remix-run/react";
import { useConfig } from "~/core/config";
import { asRouteHandle } from "~/core/handles";
import { Footer } from "~/core/layout/footer";
import { Header } from "~/core/layout/header";
import { PageBackground } from "~/core/layout/pageBackground";

export default function Route() {
  const { featureFlagSiteOnline } = useConfig();
  const matches = useMatches();
  const routeHandles = matches.map((match) => asRouteHandle(match.handle));
  const hasExpandedPageBackground = routeHandles.some(
    (handle) => handle.hasExpandedPageBackground
  );

  return (
    <>
      <PageBackground
        isExpanded={featureFlagSiteOnline && hasExpandedPageBackground}
      />

      {featureFlagSiteOnline ? <Header /> : null}
      <Outlet />
      {featureFlagSiteOnline ? <Footer /> : null}
    </>
  );
}

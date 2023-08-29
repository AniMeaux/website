import { useConfig } from "#core/config.ts";
import { asRouteHandle } from "#core/handles.ts";
import { Footer } from "#core/layout/footer.tsx";
import { Header } from "#core/layout/header.tsx";
import { PageBackground } from "#core/layout/pageBackground.tsx";
import { Outlet, useMatches } from "@remix-run/react";

export default function Route() {
  const { featureFlagSiteOnline } = useConfig();
  const matches = useMatches();
  const routeHandles = matches.map((match) => asRouteHandle(match.handle));
  const hasExpandedPageBackground = routeHandles.some(
    (handle) => handle.hasExpandedPageBackground,
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

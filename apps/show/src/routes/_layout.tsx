import { asRouteHandle } from "#core/handles";
import { Footer } from "#core/layout/footer";
import { Header } from "#core/layout/header";
import { PageBackground } from "#core/layout/page-background";
import { Outlet, useMatches } from "@remix-run/react";

export default function Route() {
  const matches = useMatches();
  const routeHandles = matches.map((match) => asRouteHandle(match.handle));

  const hasExpandedPageBackground = routeHandles.some(
    (handle) => handle.hasExpandedPageBackground,
  );

  return (
    <>
      <PageBackground isExpanded={hasExpandedPageBackground} />

      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

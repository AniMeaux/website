import { asRouteHandle } from "#core/handles";
import { Footer } from "#core/layout/footer";
import { Header } from "#core/layout/header";
import { PageBackground } from "#core/layout/page-background";
import { Routes } from "#core/navigation";
import { Outlet, useLocation, useMatches } from "@remix-run/react";

export default function Route() {
  const location = useLocation();
  const matches = useMatches();
  const routeHandles = matches.map((match) => asRouteHandle(match.handle));

  const hasExpandedPageBackground = routeHandles.some(
    (handle) => handle.hasExpandedPageBackground,
  );

  return (
    <>
      <PageBackground isExpanded={hasExpandedPageBackground} />

      {CLIENT_ENV.FEATURE_FLAG_SITE_ONLINE === "true" ||
      location.pathname !== Routes.home.toString() ? (
        <Header.Root />
      ) : null}

      <Outlet />

      <Footer.Root>
        <Footer.WaveSection />

        <Footer.ContentSection className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center lg:gap-8">
          <Footer.AnimeauxLogo />

          <Footer.Links />
        </Footer.ContentSection>

        <Footer.LegalSection />
      </Footer.Root>
    </>
  );
}

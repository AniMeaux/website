import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { asRouteHandle } from "#core/handles";
import { Footer } from "#core/layout/footer";
import { Header } from "#core/layout/header";
import { PageBackground } from "#core/layout/page-background";
import { prisma } from "#core/prisma.server";
import { json } from "@remix-run/node";
import { Outlet, useMatches } from "@remix-run/react";

export type loader = typeof loader;

export async function loader() {
  const { featureFlagShowPartners, featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline || !featureFlagShowPartners) {
    return json({ partners: [] });
  }

  const partners = await prisma.showPartner.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      image: true,
      name: true,
      url: true,
    },
  });

  return json({ partners });
}

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

      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

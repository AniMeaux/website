import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage } from "#core/data-display/error-page";
import type { RouteHandle } from "#core/handles";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { HomePage } from "./home-page";
import { WaitingPage } from "./waiting-page";

export const handle: RouteHandle = {
  hasExpandedPageBackground: true,
};

export async function loader() {
  const { featureFlagShowExhibitors, featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline || !featureFlagShowExhibitors) {
    return json({ exhibitorCount: 60, providers: [] });
  }

  const { exhibitorCount, providers } = await promiseHash({
    exhibitorCount: prisma.exhibitor.count(),

    providers: prisma.showProvider.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        image: true,
        name: true,
        url: true,
      },
    }),
  });

  return json({ exhibitorCount, providers });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle() });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { featureFlagSiteOnline } = useConfig();

  if (featureFlagSiteOnline) {
    return <HomePage />;
  }

  return <WaitingPage />;
}

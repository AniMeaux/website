import { ErrorPage } from "#core/data-display/error-page";
import type { RouteHandle } from "#core/handles";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { services } from "#core/services/services.server";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { RouteOnline } from "./route-online";
import { RouteWaiting } from "./route-waiting";

export const handle: RouteHandle = {
  hasExpandedPageBackground: true,
};

export async function loader() {
  const { exhibitorCount, partners, providers } = await promiseHash({
    exhibitorCount:
      process.env.FEATURE_FLAG_SITE_ONLINE === "true" &&
      process.env.FEATURE_FLAG_SHOW_EXHIBITORS === "true"
        ? services.exhibitor.getVisibleCount()
        : Promise.resolve(null),

    partners:
      process.env.FEATURE_FLAG_SITE_ONLINE === "true" &&
      process.env.FEATURE_FLAG_SHOW_PARTNERS === "true"
        ? services.partner.getManyVisible()
        : Promise.resolve([]),

    providers:
      process.env.FEATURE_FLAG_SITE_ONLINE === "true" &&
      process.env.FEATURE_FLAG_SHOW_PROVIDERS === "true"
        ? services.provider.getManyVisible()
        : Promise.resolve([]),
  });

  return json({ exhibitorCount, partners, providers });
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle() });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  if (CLIENT_ENV.FEATURE_FLAG_SITE_ONLINE === "true") {
    return <RouteOnline />;
  }

  return <RouteWaiting />;
}

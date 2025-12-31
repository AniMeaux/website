import { ErrorPage } from "#i/core/data-display/error-page";
import type { RouteHandle } from "#i/core/handles";
import { createSocialMeta } from "#i/core/meta";
import { getPageTitle } from "#i/core/page-title";
import { services } from "#i/core/services.server.js";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { RouteOnline } from "./route-online";
import { RouteWaiting } from "./route-waiting";

export const handle: RouteHandle = {
  hasExpandedPageBackground: true,
};

export async function loader() {
  const { exhibitorCount, sponsors, providers } = await promiseHash({
    exhibitorCount:
      process.env.FEATURE_FLAG_SITE_ONLINE === "true" &&
      process.env.FEATURE_FLAG_SHOW_EXHIBITORS === "true"
        ? // Don't count visible exhibitors only.
          services.exhibitor.getCount()
        : Promise.resolve(null),

    sponsors:
      process.env.FEATURE_FLAG_SITE_ONLINE === "true" &&
      process.env.FEATURE_FLAG_SHOW_SPONSORS === "true"
        ? services.sponsor.getManyVisible()
        : Promise.resolve([]),

    providers:
      process.env.FEATURE_FLAG_SITE_ONLINE === "true" &&
      process.env.FEATURE_FLAG_SHOW_PROVIDERS === "true"
        ? services.provider.getManyVisible()
        : Promise.resolve([]),
  });

  return json({ exhibitorCount, sponsors, providers });
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

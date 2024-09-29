import { ErrorPage } from "#core/data-display/error-page";
import type { RouteHandle } from "#core/handles";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { WaitingPage } from "./waiting-page";

export const handle: RouteHandle = {
  hasExpandedPageBackground: true,
};

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle() });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return <WaitingPage />;
}

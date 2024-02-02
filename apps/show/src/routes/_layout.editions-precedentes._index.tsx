import { useConfig } from "#core/config";
import { createConfig } from "#core/config.server";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NotFoundResponse } from "#core/response.server";
import { SORTED_PREVIOUS_EDITIONS } from "#previous-editions/previous-edition";
import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader() {
  const { featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  throw redirect(Routes.previousEditions(SORTED_PREVIOUS_EDITIONS[0]));
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  return null;
}

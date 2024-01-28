import { createConfig } from "#core/config.server.ts";
import { useConfig } from "#core/config.ts";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { createSocialMeta } from "#core/meta.ts";
import { Routes } from "#core/navigation.tsx";
import { getPageTitle } from "#core/pageTitle.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { SORTED_PREVIOUS_EDITIONS } from "#previousEditions/previousEdition.tsx";
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

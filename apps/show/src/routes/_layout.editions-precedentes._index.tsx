import { redirect } from "@remix-run/node";
import { V2_MetaFunction } from "@remix-run/react";
import { useConfig } from "~/core/config";
import { createConfig } from "~/core/config.server";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { createSocialMeta } from "~/core/meta";
import { Routes } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { SORTED_PREVIOUS_EDITIONS } from "~/previousEditions/previousEdition";

export async function loader() {
  const { featureFlagSiteOnline } = createConfig();

  if (!featureFlagSiteOnline) {
    throw new NotFoundResponse();
  }

  throw redirect(Routes.previousEditions(SORTED_PREVIOUS_EDITIONS[0]));
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
};

export function ErrorBoundary() {
  const { featureFlagSiteOnline } = useConfig();

  return <ErrorPage isStandAlone={!featureFlagSiteOnline} />;
}

export default function Route() {
  return null;
}

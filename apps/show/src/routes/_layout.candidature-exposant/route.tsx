import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader() {
  if (process.env.FEATURE_FLAG_EXHIBITOR_APPLICATION_ONLINE !== "true") {
    throw notFound();
  }

  throw redirect(Routes.exhibitors.application.toString());
}

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return null;
}

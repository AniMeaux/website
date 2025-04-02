import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { Routes } from "#core/navigation.js";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { ShowDay } from "#core/show-day";
import type { MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { SectionTitle } from "./section-title";
import { SectionWaitingHelper } from "./section-waiting-helper";

export async function loader() {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound();
  }

  if (process.env.FEATURE_FLAG_SHOW_PROGRAM === "true") {
    throw redirect(Routes.program.day(ShowDay.Enum.SATURDAY).toString());
  }

  return json("ok" as const);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Programme" : getErrorTitle(404)),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionWaitingHelper />
    </>
  );
}

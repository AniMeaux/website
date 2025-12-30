import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page";
import { createSocialMeta } from "#i/core/meta";
import { getPageTitle } from "#i/core/page-title";
import { notFound } from "#i/core/response.server";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { SectionCarpool } from "./section-carpool";
import { SectionEcology } from "./section-ecology";
import { SectionInformation } from "./section-information";
import { SectionTitle } from "./section-title";

export async function loader() {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound();
  }

  return json("ok" as const);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Accès au salon" : getErrorTitle(404)),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionEcology />
      <SectionCarpool />
      <SectionInformation />
    </>
  );
}

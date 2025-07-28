import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server";
import { SectionInformation } from "./section-information";
import { SectionTitle } from "./section-title";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? "Candidature exposant" : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionInformation />
    </>
  );
}

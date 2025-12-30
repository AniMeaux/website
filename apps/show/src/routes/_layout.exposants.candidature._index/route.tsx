import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page";
import { createSocialMeta } from "#i/core/meta";
import { getPageTitle } from "#i/core/page-title";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server";
import { SectionDescription } from "./section-description";
import { SectionForm } from "./section-form";
import { SectionTitle } from "./section-title";

export { action } from "./action.server";
export { loader } from "./loader.server";

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
      <SectionDescription />
      <SectionForm />
    </>
  );
}

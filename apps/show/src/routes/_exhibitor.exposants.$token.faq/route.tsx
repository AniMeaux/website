import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page";
import { createSocialMeta } from "#i/core/meta";
import { getPageTitle } from "#i/core/page-title";
import type { MetaFunction } from "@remix-run/node";
import type { loader } from "./loader.server";
import { SectionMoreQuestions } from "./section-more-questions";
import { SectionQuestions } from "./section-questions";
import { SectionTitle } from "./section-title";

export { loader } from "./loader.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? "Foire aux questions" : getErrorTitle(404),
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
      <SectionQuestions />
      <SectionMoreQuestions />
    </>
  );
}

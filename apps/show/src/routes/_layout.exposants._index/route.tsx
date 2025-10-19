import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import type { loader } from "./loader.server.js";
import { SectionList } from "./section-list";
import { SectionTitle } from "./section-title";
import { SectionWaitingHelper } from "./section-waiting-helper";

export { loader } from "./loader.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data?.exhibitors != null ? "Exposants" : getErrorTitle(404),
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

      {CLIENT_ENV.FEATURE_FLAG_SHOW_EXHIBITORS === "true" ? (
        <SectionList />
      ) : (
        <SectionWaitingHelper />
      )}
    </>
  );
}

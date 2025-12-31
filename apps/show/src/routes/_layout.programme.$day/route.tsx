import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js";
import { createSocialMeta } from "#i/core/meta.js";
import { getPageTitle } from "#i/core/page-title.js";
import type { MetaFunction } from "@remix-run/react";
import type { loader } from "./loader.server.js";
import { SectionEventList } from "./section-event-list";
import { SectionOnStandEvents } from "./section-on-stand-events";
import { SectionTitle } from "./section-title";

export { loader } from "./loader.server.js";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? `Programme du ${data.day}` : getErrorTitle(404),
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
      <SectionEventList />
      <SectionOnStandEvents />
    </>
  );
}

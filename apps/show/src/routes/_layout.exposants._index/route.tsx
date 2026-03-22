import type { MetaFunction } from "@remix-run/node"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"

import type { loader } from "./loader.server.js"
import { SectionList } from "./section-list.js"
import { SectionTitle } from "./section-title.js"
import { SectionWaitingHelper } from "./section-waiting-helper.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data?.exhibitors != null ? "Exposants" : getErrorTitle(404),
    ),
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
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
  )
}

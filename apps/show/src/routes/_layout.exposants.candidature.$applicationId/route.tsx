import type { MetaFunction } from "@remix-run/react"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"

import type { loader } from "./loader.server.js"
import { SectionInformation } from "./section-information.js"
import { SectionTitle } from "./section-title.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? "Candidature exposant" : getErrorTitle(404),
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
      <SectionInformation />
    </>
  )
}

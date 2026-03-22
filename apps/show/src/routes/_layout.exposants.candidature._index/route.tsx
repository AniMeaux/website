import type { MetaFunction } from "@remix-run/react"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"

import type { loader } from "./loader.server.js"
import { SectionDescription } from "./section-description.js"
import { SectionForm } from "./section-form.js"
import { SectionTitle } from "./section-title.js"

export { action } from "./action.server.js"
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
      <SectionDescription />
      <SectionForm />
    </>
  )
}

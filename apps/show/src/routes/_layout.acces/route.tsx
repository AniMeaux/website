import type { MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { createSocialMeta } from "#i/core/meta.js"
import { getPageTitle } from "#i/core/page-title.js"
import { notFound } from "#i/core/response.server.js"

import { SectionCarpool } from "./section-carpool.js"
import { SectionEcology } from "./section-ecology.js"
import { SectionInformation } from "./section-information.js"
import { SectionTitle } from "./section-title.js"

export async function loader() {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound()
  }

  return json("ok" as const)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Accès au salon" : getErrorTitle(404)),
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionEcology />
      <SectionCarpool />
      <SectionInformation />
    </>
  )
}

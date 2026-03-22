import type { MetaFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { createSocialMeta } from "#i/core/meta.js"
import { Routes } from "#i/core/navigation.js"
import { getPageTitle } from "#i/core/page-title.js"
import { notFound } from "#i/core/response.server.js"
import { ShowDay } from "#i/core/show-day.js"

import { SectionTitle } from "./section-title.js"
import { SectionWaitingHelper } from "./section-waiting-helper.js"

export async function loader() {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound()
  }

  if (process.env.FEATURE_FLAG_SHOW_PROGRAM === "true") {
    throw redirect(Routes.program.day(ShowDay.Enum.SATURDAY).toString())
  }

  return json("ok" as const)
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(data === "ok" ? "Programme" : getErrorTitle(404)),
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionWaitingHelper />
    </>
  )
}

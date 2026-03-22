import type { MetaFunction } from "@remix-run/node"

import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { PageLayout } from "#i/core/layout/page.js"
import { getPageTitle } from "#i/core/page-title.js"

import { CardForm } from "./card-form.js"
import type { loader } from "./loader.server.js"

export { action } from "./action.server.js"
export { loader } from "./loader.server.js"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily
  if (fosterFamily == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }]
  }

  return [{ title: getPageTitle(`Modifier ${fosterFamily.displayName}`) }]
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <CardForm />
      </PageLayout.Content>
    </PageLayout.Root>
  )
}

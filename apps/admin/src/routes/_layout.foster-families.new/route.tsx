import type { MetaFunction } from "@remix-run/node"

import { ErrorPage } from "#i/core/data-display/error-page.js"
import { PageLayout } from "#i/core/layout/page.js"
import { getPageTitle } from "#i/core/page-title.js"

import { CardForm } from "./card-form.js"

export { action } from "./action.server.js"
export { loader } from "./loader.server.js"

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Nouvelle famille d’accueil") }]
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

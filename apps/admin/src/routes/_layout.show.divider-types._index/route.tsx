import type { MetaFunction } from "@remix-run/react"

import { PageLayout } from "#i/core/layout/page.js"
import { getPageTitle } from "#i/core/page-title.js"

import { CardList } from "./card-list.js"

export { loader } from "./loader.server.js"

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Cloisons") }]
}

export default function Route() {
  return (
    <PageLayout.Content className="grid grid-cols-1 md:min-w-0">
      <CardList />
    </PageLayout.Content>
  )
}

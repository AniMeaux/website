import { useLoaderData } from "@remix-run/react"

import { Header } from "#i/core/layout/header.js"
import { Routes } from "#i/core/navigation.js"

import type { loader } from "./route.js"

export function LayoutHeader() {
  const { exhibitor } = useLoaderData<typeof loader>()

  const routes = Routes.exhibitors.token(exhibitor.token)

  return (
    <Header.Root>
      <Header.NavItem to={routes.toString()} exclude={routes.faq.toString()}>
        {exhibitor.name}
      </Header.NavItem>

      <Header.NavItem to={routes.faq.toString()}>FAQ</Header.NavItem>
    </Header.Root>
  )
}

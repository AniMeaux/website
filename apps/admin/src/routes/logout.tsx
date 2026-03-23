import type { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { createPath } from "history"

import { Routes } from "#i/core/navigation.js"
import { destroyCurrentUserSession } from "#i/current-user/session.server.js"

export async function loader() {
  // Nothing to render here.
  return redirect(Routes.home.toString())
}

export async function action({ request }: ActionFunctionArgs) {
  return redirect(
    createPath({
      pathname: Routes.login.toString(),
      search: new URL(request.url).searchParams.toString(),
    }),
    { headers: { "Set-Cookie": await destroyCurrentUserSession() } },
  )
}

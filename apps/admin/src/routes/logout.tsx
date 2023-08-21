import { ActionArgs, redirect } from "@remix-run/node";
import { createPath } from "history";
import { Routes } from "~/core/navigation";
import { destroyCurrentUserSession } from "~/currentUser/session.server";

export async function loader() {
  // Nothing to render here.
  return redirect(Routes.home.toString());
}

export async function action({ request }: ActionArgs) {
  return redirect(
    createPath({
      pathname: Routes.login.toString(),
      search: new URL(request.url).searchParams.toString(),
    }),
    { headers: { "Set-Cookie": await destroyCurrentUserSession() } }
  );
}

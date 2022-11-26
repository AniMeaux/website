import { ActionArgs, redirect } from "@remix-run/node";
import { createPath } from "history";
import { destroyUserSession } from "~/currentUser/currentUser.server";

export async function loader() {
  // Nothing to render here.
  return redirect("/");
}

export async function action({ request }: ActionArgs) {
  return redirect(
    createPath({
      pathname: "/login",
      search: new URL(request.url).searchParams.toString(),
    }),
    { headers: { "Set-Cookie": await destroyUserSession() } }
  );
}

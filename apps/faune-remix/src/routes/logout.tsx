import { ActionArgs, redirect } from "@remix-run/node";
import { createPath } from "history";
import { destroyUserSession } from "~/core/currentUser.server";
import { getNext, setNext } from "~/core/params";

export async function loader() {
  // Nothing to render here.
  return redirect("/");
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  return redirect(
    createPath({
      pathname: "/login",
      search: setNext(new URLSearchParams(), getNext(formData)).toString(),
    }),
    { headers: { "Set-Cookie": await destroyUserSession() } }
  );
}

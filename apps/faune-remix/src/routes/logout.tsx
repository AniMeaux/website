import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { createPath } from "history";
import { destroyUserSession } from "~/core/currentUser.server";
import { getNext, setNext } from "~/core/params";

export const loader: LoaderFunction = async () => {
  // Nothing to render here.
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  return redirect(
    createPath({
      pathname: "/login",
      search: setNext(new URLSearchParams(), getNext(formData)).toString(),
    }),
    { headers: { "Set-Cookie": await destroyUserSession() } }
  );
};

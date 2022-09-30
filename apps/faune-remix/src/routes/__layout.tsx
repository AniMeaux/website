import { LoaderFunction } from "@remix-run/node";
import { Form, Outlet, useLocation } from "@remix-run/react";
import { createPath } from "history";
import { BaseLink } from "~/core/baseLink";
import { getCurrentUserId } from "~/core/currentUser.server";
import { NextParamInput } from "~/core/params";

export const loader: LoaderFunction = async ({ request }) => {
  // Avoid leaking pages to non authenticated users.
  await getCurrentUserId(request);
  return null;
};

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <header>
        <BaseLink to="/">Go home</BaseLink>

        <Form method="post" action="/logout">
          <NextParamInput value={createPath(location)} />
          <button type="submit">Logout</button>
        </Form>
      </header>

      <Outlet />
    </>
  );
}

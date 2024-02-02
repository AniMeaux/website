import { db } from "#core/db.server";
import { Routes } from "#core/navigation";
import { commitCurrentUserPreferences } from "#current-user/preferences.server";
import { ActionFormData } from "#routes/resources.preferences/shared";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export async function loader() {
  // Nothing to render here.
  return redirect(Routes.home.toString());
}

export type action = typeof action;

export async function action({ request }: ActionFunctionArgs) {
  // Only a logged in user can change there settings.
  await db.currentUser.get(request, { select: { id: true } });

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json({ errors: formData.error.flatten() }, { status: 400 });
  }

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitCurrentUserPreferences(formData.data),
      },
    },
  );
}

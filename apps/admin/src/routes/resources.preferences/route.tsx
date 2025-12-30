import { db } from "#i/core/db.server";
import { Routes } from "#i/core/navigation";
import { commitCurrentUserPreferences } from "#i/current-user/preferences.server";
import { ActionFormData } from "#i/routes/resources.preferences/shared";
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

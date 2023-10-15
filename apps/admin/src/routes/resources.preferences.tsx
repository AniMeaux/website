import { db } from "#core/db.server.ts";
import { Routes } from "#core/navigation.ts";
import { commitCurrentUserPreferences } from "#currentUser/preferences.server.ts";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCallback, useMemo } from "react";

export async function loader() {
  // Nothing to render here.
  return redirect(Routes.home.toString());
}

const ActionFormData = FormDataDelegate.create(
  zu.object({
    isSideBarCollapsed: zu.checkbox(),
  }),
);

export async function action({ request }: ActionArgs) {
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

export function usePreferencesFetcher() {
  const fetcher = useFetcher<typeof action>();

  const fetcherSubmit = fetcher.submit;
  const submit = useCallback(
    (preferences: zu.infer<typeof ActionFormData.schema>) => {
      const formData = new FormData();
      if (preferences.isSideBarCollapsed) {
        formData.set(ActionFormData.keys.isSideBarCollapsed, "on");
      }

      fetcherSubmit(formData, {
        method: "POST",
        action: Routes.resources.preferences.toString(),
      });
    },
    [fetcherSubmit],
  );

  const fetcherFormData = fetcher.formData;
  const formData = useMemo(() => {
    if (fetcherFormData == null) {
      return undefined;
    }

    return ActionFormData.parse(fetcherFormData);
  }, [fetcherFormData]);

  return useMemo(() => ({ submit, formData }), [submit, formData]);
}

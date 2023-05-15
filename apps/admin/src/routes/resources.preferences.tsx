import { ActionArgs, json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { createActionData, ensureBoolean } from "~/core/schemas";
import { getCurrentUser } from "~/currentUser/db.server";
import { commitCurrentUserPreferences } from "~/currentUser/preferences.server";

const RESOURCE_PATHNAME = "/resources/preferences";

export async function loader() {
  // Nothing to render here.
  return redirect("/");
}

const ActionFormData = createActionData(
  z.object({
    isSideBarCollapsed: z.preprocess(ensureBoolean, z.boolean()),
  })
);

export async function action({ request }: ActionArgs) {
  // Only a logged in user can change there settings.
  await getCurrentUser(request, { select: { id: true } });

  const rawFormData = await request.formData();
  const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);

  if (!formData.success) {
    return json({ errors: formData.error.flatten() }, { status: 400 });
  }

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitCurrentUserPreferences(formData.data),
      },
    }
  );
}

export function usePreferencesFetcher() {
  const fetcher = useFetcher<typeof action>();

  const fetcherSubmit = fetcher.submit;
  const submit = useCallback(
    (preferences: z.infer<typeof ActionFormData.schema>) => {
      const formData = new FormData();
      formData.set(
        ActionFormData.keys.isSideBarCollapsed,
        String(preferences.isSideBarCollapsed)
      );

      fetcherSubmit(formData, { method: "POST", action: RESOURCE_PATHNAME });
    },
    [fetcherSubmit]
  );

  const fetcherFormData = fetcher.formData;
  const formData = useMemo(() => {
    if (fetcherFormData == null) {
      return undefined;
    }

    return zfd.formData(ActionFormData.schema).parse(fetcherFormData);
  }, [fetcherFormData]);

  return useMemo(() => ({ submit, formData }), [submit, formData]);
}

import { Routes } from "#core/navigation";
import type { action } from "#routes/resources.preferences/route";
import { ActionFormData } from "#routes/resources.preferences/shared";
import type { zu } from "@animeaux/zod-utils";
import { useFetcher } from "@remix-run/react";
import { useCallback, useMemo } from "react";

export function usePreferencesFetcher() {
  const fetcher = useFetcher<action>();

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

import { Routes } from "#i/core/navigation";
import { zu } from "@animeaux/zod-utils";
import { useFetcher } from "@remix-run/react";
import { createPath } from "history";
import { useEffect, useMemo } from "react";
import type { loader } from "./route";
import { ScrapUrlSearchParams } from "./shared";

export function useScrapUrlFetcher({
  url,
  isEnabled,
}: {
  url: string;
  isEnabled: boolean;
}) {
  const { load, data, state } = useFetcher<typeof loader>();

  useEffect(() => {
    if (isEnabled) {
      const result = zu.string().url().safeParse(url);
      if (result.success) {
        load(
          createPath({
            pathname: Routes.resources.scrapUrl.toString(),
            search: ScrapUrlSearchParams.format({ url: result.data }),
          }),
        );
      }
    }
  }, [url, isEnabled, load]);

  return useMemo(() => ({ data, state }), [data, state]);
}

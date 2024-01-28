import { Routes } from "#core/navigation";
import type { loader } from "#routes/resources.scrap-url/route";
import { ScrapUrlSearchParams } from "#routes/resources.scrap-url/shared";
import { zu } from "@animeaux/zod-utils";
import { useFetcher } from "@remix-run/react";
import { createPath } from "history";
import { useEffect, useMemo } from "react";

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
            search: ScrapUrlSearchParams.stringify({ url: result.data }),
          }),
        );
      }
    }
  }, [url, isEnabled, load]);

  return useMemo(() => ({ data, state }), [data, state]);
}

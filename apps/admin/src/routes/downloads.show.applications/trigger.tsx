import { DownloadTrigger } from "#core/actions/download-trigger.js";
import { Routes } from "#core/navigation";
import { ApplicationSearchParams } from "#show/exhibitors/applications/search-params.js";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { createPath } from "history";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const DownloadApplicationsTrigger = forwardRef<
  React.ComponentRef<typeof DownloadTrigger>,
  Except<
    React.ComponentPropsWithoutRef<typeof DownloadTrigger>,
    "url" | "fileName"
  >
>(function DownloadApplicationsTrigger(props, ref) {
  const [searchParams] = useOptimisticSearchParams();

  const applicationSearchParams = ApplicationSearchParams.copy(
    searchParams,
    new URLSearchParams(),
  );

  return (
    <DownloadTrigger
      {...props}
      ref={ref}
      fileName="candidatures-exposant.csv"
      url={createPath({
        pathname: Routes.downloads.show.applications.toString(),
        search: applicationSearchParams.toString(),
      })}
    />
  );
});

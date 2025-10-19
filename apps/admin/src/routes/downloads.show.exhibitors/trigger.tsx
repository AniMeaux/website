import { DownloadTrigger } from "#core/actions/download-trigger.js";
import { Routes } from "#core/navigation";
import { ExhibitorSearchParams } from "#show/exhibitors/search-params.js";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { createPath } from "history";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const DownloadExhibitorsTrigger = forwardRef<
  React.ComponentRef<typeof DownloadTrigger>,
  Except<
    React.ComponentPropsWithoutRef<typeof DownloadTrigger>,
    "url" | "fileName"
  >
>(function DownloadExhibitorsTrigger(props, ref) {
  const [searchParams] = useOptimisticSearchParams();

  const exhibitorSearchParams = ExhibitorSearchParams.copy(
    searchParams,
    new URLSearchParams(),
  );

  return (
    <DownloadTrigger
      {...props}
      ref={ref}
      fileName="exposants.csv"
      url={createPath({
        pathname: Routes.downloads.show.exhibitors.toString(),
        search: exhibitorSearchParams.toString(),
      })}
    />
  );
});

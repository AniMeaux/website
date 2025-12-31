import { DownloadTrigger } from "#i/core/actions/download-trigger.js";
import { Routes } from "#i/core/navigation";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const DownloadPictureLink = forwardRef<
  React.ComponentRef<typeof DownloadTrigger>,
  Except<React.ComponentPropsWithoutRef<typeof DownloadTrigger>, "url"> & {
    pictureId: string;
  }
>(function DownloadPictureLink({ pictureId, ...props }, ref) {
  return (
    <DownloadTrigger
      {...props}
      ref={ref}
      url={Routes.downloads.picture.id(pictureId).toString()}
    />
  );
});

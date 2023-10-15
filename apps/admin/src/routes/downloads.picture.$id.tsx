import { createConfig } from "#core/config.server.ts";
import { createCloudinaryUrl } from "#core/dataDisplay/image.tsx";
import { db } from "#core/db.server.ts";
import { Routes } from "#core/navigation.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";

const ParamsSchema = zu.object({
  id: zu.string(),
});

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw new NotFoundResponse();
  }

  const config = createConfig();
  const url = createCloudinaryUrl(config.cloudinaryName, paramsResult.data.id, {
    aspectRatio: "none",
    format: "jpg",
  });

  return await fetch(url);
}

type DownloadPictureLinkProps = {
  children?: React.ReactNode;
  className?: string;
  fileName: string;
  pictureId: string;
};

export function DownloadPictureLink({
  children,
  className,
  fileName,
  pictureId,
}: DownloadPictureLinkProps) {
  // We can't use a regular download anchor because of native UI not displayed
  // on iOS when the application is in standalone (installed).
  // https://developer.apple.com/forums/thread/95911
  return (
    <button
      onClick={() =>
        download(fileName, Routes.downloads.picture.id(pictureId).toString())
      }
      className={className}
    >
      {children}
    </button>
  );
}

function download(fileName: string, url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function onLoad() {
    if (this.status === 200) {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(this.response);
      link.download = fileName;
      link.click();
    }
  };

  xhr.send();
}

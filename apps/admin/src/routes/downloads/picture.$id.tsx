import { UserGroup } from "@prisma/client";
import { LoaderArgs } from "@remix-run/node";
import { z } from "zod";
import { createConfig } from "~/core/config.server";
import { createCloudinaryUrl } from "~/core/dataDisplay/image";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const id = z.string().safeParse(params["id"]);
  if (!id.success) {
    throw new NotFoundResponse();
  }

  const config = createConfig();
  const url = createCloudinaryUrl(config.cloudinaryName, id.data, {
    aspectRatio: "none",
    format: "jpg",
  });

  return await fetch(url);
}

const RESOURCE_PATHNAME = "/downloads/picture";

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
      onClick={() => download(fileName, `${RESOURCE_PATHNAME}/${pictureId}`)}
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

import { UserGroup } from "@prisma/client";
import { LoaderArgs } from "@remix-run/node";
import { z } from "zod";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { createConfig } from "~/core/config.server";
import { createCloudinaryUrl } from "~/core/dataDisplay/image";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
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

export function DownloadPictureLink({
  fileName,
  pictureId,
  ...rest
}: Omit<
  BaseLinkProps,
  "prefetch" | "reloadDocument" | "shouldOpenInNewTarget" | "to"
> & {
  fileName: string;
  pictureId: string;
}) {
  return (
    <BaseLink
      download={fileName}
      prefetch="none"
      reloadDocument
      to={`${RESOURCE_PATHNAME}/${pictureId}`}
      {...rest}
    />
  );
}

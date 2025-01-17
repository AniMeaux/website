import { createConfig } from "#core/config.server";
import { createCloudinaryUrl } from "#core/data-display/image";
import { db } from "#core/db.server";
import { notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";

const ParamsSchema = zu.object({
  id: zu.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
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
    throw notFound();
  }

  const config = createConfig();
  const url = createCloudinaryUrl(config.cloudinaryName, paramsResult.data.id, {
    aspectRatio: "none",
    format: "jpg",
  });

  return await fetch(url);
}

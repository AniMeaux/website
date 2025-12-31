import { createConfig } from "#i/core/config.server";
import { createCloudinaryUrl } from "#i/core/data-display/image";
import { db } from "#i/core/db.server";
import { notFound } from "#i/core/response.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { UserGroup } from "@animeaux/prisma";
import { zu } from "@animeaux/zod-utils";
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

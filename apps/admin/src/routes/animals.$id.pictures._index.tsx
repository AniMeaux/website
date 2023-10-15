import { db } from "#core/db.server.ts";
import { assertIsDefined } from "#core/isDefined.server.ts";
import { Routes } from "#core/navigation.ts";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
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

  const animal = await prisma.animal.findUnique({
    where: { id: paramsResult.data.id },
    select: { alias: true, avatar: true, name: true },
  });

  assertIsDefined(animal);

  throw redirect(
    Routes.animals
      .id(paramsResult.data.id)
      .pictures.pictureId(animal.avatar)
      .toString(),
  );
}

// This export is required for parent's `ErrorBoundary` to work.
export default function Route() {
  return null;
}

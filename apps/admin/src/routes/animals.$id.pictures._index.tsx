import { db } from "#i/core/db.server";
import { assertIsDefined } from "#i/core/is-defined.server";
import { Routes } from "#i/core/navigation";
import { prisma } from "#i/core/prisma.server";
import { notFound } from "#i/core/response.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { UserGroup } from "@animeaux/prisma";
import { zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
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

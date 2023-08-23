import { db } from "#core/db.server.ts";
import { assertIsDefined } from "#core/isDefined.server.ts";
import { Routes } from "#core/navigation.ts";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { UserGroup } from "@prisma/client";
import { LoaderArgs, redirect } from "@remix-run/node";
import { z } from "zod";

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

  const id = z.string().uuid().safeParse(params["id"]);
  if (!id.success) {
    throw new NotFoundResponse();
  }

  const animal = await prisma.animal.findUnique({
    where: { id: id.data },
    select: { alias: true, avatar: true, name: true },
  });

  assertIsDefined(animal);

  throw redirect(
    Routes.animals.id(id.data).pictures.pictureId(animal.avatar).toString()
  );
}

// This export is required for parent's `ErrorBoundary` to work.
export default function Route() {
  return null;
}

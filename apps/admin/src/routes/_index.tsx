import { db } from "#core/db.server.ts";
import { Routes } from "#core/navigation.ts";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  return redirect(
    USER_GROUP_LANDING_PAGE[getUserMainGroup(currentUser.groups)],
  );
}

const USER_GROUP_LANDING_PAGE: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: Routes.animals.toString(),
  [UserGroup.ANIMAL_MANAGER]: Routes.animals.toString(),
  [UserGroup.BLOGGER]: Routes.home.toString(),
  [UserGroup.HEAD_OF_PARTNERSHIPS]: Routes.home.toString(),
  [UserGroup.VETERINARIAN]: Routes.animals.toString(),
  [UserGroup.VOLUNTEER]: Routes.animals.toString(),
};

function getUserMainGroup(groups: UserGroup[]): UserGroup {
  if (groups.includes(UserGroup.VOLUNTEER)) {
    return UserGroup.VOLUNTEER;
  }

  if (groups.includes(UserGroup.ADMIN)) {
    return UserGroup.ADMIN;
  }

  if (groups.includes(UserGroup.ANIMAL_MANAGER)) {
    return UserGroup.ANIMAL_MANAGER;
  }

  if (groups.includes(UserGroup.VETERINARIAN)) {
    return UserGroup.VETERINARIAN;
  }

  if (groups.includes(UserGroup.BLOGGER)) {
    return UserGroup.BLOGGER;
  }

  return UserGroup.HEAD_OF_PARTNERSHIPS;
}

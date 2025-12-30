import { db } from "#i/core/db.server";
import { Routes } from "#i/core/navigation";
import { UserGroup } from "@animeaux/prisma";
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
  [UserGroup.ADMIN]: Routes.dashboard.toString(),
  [UserGroup.ANIMAL_MANAGER]: Routes.dashboard.toString(),
  [UserGroup.BLOGGER]: Routes.home.toString(),
  [UserGroup.HEAD_OF_PARTNERSHIPS]: Routes.home.toString(),
  [UserGroup.SHOW_ORGANIZER]: Routes.show.toString(),
  [UserGroup.VETERINARIAN]: Routes.animals.toString(),
  [UserGroup.VOLUNTEER]: Routes.animals.toString(),
};

function getUserMainGroup(groups: UserGroup[]): UserGroup {
  if (groups.includes(UserGroup.ADMIN)) {
    return UserGroup.ADMIN;
  }

  if (groups.includes(UserGroup.ANIMAL_MANAGER)) {
    return UserGroup.ANIMAL_MANAGER;
  }

  if (groups.includes(UserGroup.SHOW_ORGANIZER)) {
    return UserGroup.SHOW_ORGANIZER;
  }

  if (groups.includes(UserGroup.VETERINARIAN)) {
    return UserGroup.VETERINARIAN;
  }

  if (groups.includes(UserGroup.BLOGGER)) {
    return UserGroup.BLOGGER;
  }

  if (groups.includes(UserGroup.HEAD_OF_PARTNERSHIPS)) {
    return UserGroup.HEAD_OF_PARTNERSHIPS;
  }

  return UserGroup.VOLUNTEER;
}

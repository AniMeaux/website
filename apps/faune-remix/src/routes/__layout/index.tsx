import { UserGroup } from "@prisma/client";
import { LoaderFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getCurrentUserId } from "~/core/currentUser.server";
import { prisma } from "~/core/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getCurrentUserId(request);

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { groups: true },
  });

  invariant(currentUser != null, "User should exists");

  return redirect(
    USER_GROUP_LANDING_PAGE[getUserMainGroup(currentUser.groups)]
  );
};

const USER_GROUP_LANDING_PAGE: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "/animaux",
  [UserGroup.ANIMAL_MANAGER]: "/animaux",
  [UserGroup.BLOGGER]: "/articles",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "/partenaires",
  [UserGroup.VETERINARIAN]: "/animaux",
};

function getUserMainGroup(groups: UserGroup[]): UserGroup {
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

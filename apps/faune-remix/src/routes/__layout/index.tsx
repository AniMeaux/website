import { UserGroup } from "@prisma/client";
import { LoaderArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "~/currentUser/currentUser.server";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  return redirect(
    USER_GROUP_LANDING_PAGE[getUserMainGroup(currentUser.groups)]
  );
}

const USER_GROUP_LANDING_PAGE: Record<UserGroup, string> = {
  [UserGroup.ADMIN]: "/animals",
  [UserGroup.ANIMAL_MANAGER]: "/animals",
  [UserGroup.BLOGGER]: "/articles",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "/partners",
  [UserGroup.VETERINARIAN]: "/animals",
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

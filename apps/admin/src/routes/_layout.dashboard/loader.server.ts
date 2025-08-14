import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { hasGroups } from "#users/groups";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { loaderAnimal } from "./loader.animal.server";
import { loaderShow } from "./loader.show.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, allowedUserGroups);

  return json({
    currentUser,

    animal: hasGroups(currentUser, sectionsGroups.animal)
      ? await loaderAnimal(currentUser)
      : null,

    show: hasGroups(currentUser, sectionsGroups.show)
      ? await loaderShow()
      : null,
  });
}

const sectionsGroups = {
  animal: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER],
  show: [UserGroup.ADMIN, UserGroup.SHOW_ORGANIZER],
};

const allowedUserGroups = Array.from(
  new Set(Object.values(sectionsGroups).flat()),
);

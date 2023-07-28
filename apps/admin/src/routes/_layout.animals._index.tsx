import { UserGroup } from "@prisma/client";
import { LoaderArgs, redirect } from "@remix-run/node";
import { db } from "~/core/db.server";
import { hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  throw redirect(
    hasGroups(currentUser, [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER])
      ? "/animals/dashboard"
      : "/animals/search"
  );
}

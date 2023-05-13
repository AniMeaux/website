import { UserGroup } from "@prisma/client";
import { LoaderArgs, redirect } from "@remix-run/node";
import { getCurrentUser } from "~/currentUser/db.server";
import { hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  throw redirect(
    hasGroups(currentUser, [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER])
      ? "/animals/dashboard"
      : "/animals/search"
  );
}

import { db } from "#core/db.server";
import { Routes } from "#core/navigation";
import { hasGroups } from "#users/groups";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  throw redirect(
    hasGroups(currentUser, [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER])
      ? Routes.animals.dashboard.toString()
      : Routes.animals.search.toString(),
  );
}

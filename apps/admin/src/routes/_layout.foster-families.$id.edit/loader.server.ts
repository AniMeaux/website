import { db } from "#i/core/db.server";
import { assertIsDefined } from "#i/core/is-defined.server";
import { prisma } from "#i/core/prisma.server";
import { notFound } from "#i/core/response.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { UserGroup } from "@animeaux/prisma/server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { routeParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = routeParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const fosterFamily = await prisma.fosterFamily.findUnique({
    where: { id: paramsResult.data.id },
    select: {
      address: true,
      availability: true,
      availabilityExpirationDate: true,
      city: true,
      comments: true,
      displayName: true,
      email: true,
      garden: true,
      housing: true,
      isBanned: true,
      phone: true,
      speciesAlreadyPresent: true,
      speciesToHost: true,
      zipCode: true,
    },
  });

  assertIsDefined(fosterFamily);

  return json({ fosterFamily });
}

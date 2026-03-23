import { UserGroup } from "@animeaux/prisma/server"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"

import { db } from "#i/core/db.server.js"
import { assertIsDefined } from "#i/core/is-defined.server.js"
import { prisma } from "#i/core/prisma.server.js"
import { notFound } from "#i/core/response.server.js"
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js"

import { routeParamsSchema } from "./route-params.js"

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ])

  const paramsResult = routeParamsSchema.safeParse(params)
  if (!paramsResult.success) {
    throw notFound()
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
  })

  assertIsDefined(fosterFamily)

  return json({ fosterFamily })
}

import { UserGroup } from "@animeaux/prisma"
import { zu } from "@animeaux/zod-utils"
import type { LoaderFunctionArgs } from "@remix-run/node"

import { createCloudinaryUrl } from "#i/core/data-display/image.js"
import { db } from "#i/core/db.server.js"
import { notFound } from "#i/core/response.server.js"
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js"

const ParamsSchema = zu.object({
  id: zu.string(),
})

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ])

  const paramsResult = ParamsSchema.safeParse(params)
  if (!paramsResult.success) {
    throw notFound()
  }

  const url = createCloudinaryUrl(
    process.env.CLOUDINARY_CLOUD_NAME,
    paramsResult.data.id,
    {
      aspectRatio: "none",
      format: "jpg",
    },
  )

  return await fetch(url)
}

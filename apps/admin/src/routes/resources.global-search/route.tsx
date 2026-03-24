import { UserGroup } from "@animeaux/prisma"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"

import { db } from "#i/core/db.server.js"
import { forbidden } from "#i/core/response.server.js"
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js"

import { Entity } from "./entity.js"
import { GlobalSearchParams } from "./search-params.js"

const MAX_HIT_COUNT = 6

export type loader = typeof loader

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.SHOW_ORGANIZER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ])

  const searchParams = GlobalSearchParams.parse(
    new URL(request.url).searchParams,
  )

  const possibleEntities = Entity.getPossibleValuesForCurrentUser(currentUser)
  const entity = searchParams.entity ?? possibleEntities[0]

  if (entity == null || !possibleEntities.includes(entity)) {
    throw forbidden()
  }

  if (searchParams.text == null) {
    return json({ items: [] })
  }

  switch (entity) {
    case Entity.Enum.ANIMAL: {
      const animals = await db.animal.fuzzySearch(searchParams.text, {
        select: {
          alias: true,
          avatar: true,
          breed: { select: { name: true } },
          color: { select: { name: true } },
          name: true,
          pickUpDate: true,
          pickUpLocation: true,
          species: true,
          status: true,
        },
        take: MAX_HIT_COUNT,
      })

      const items = animals.map((animal) => ({
        type: Entity.Enum.ANIMAL,
        ...animal,
      }))

      return json({ items })
    }

    case Entity.Enum.EXHIBITOR: {
      const exhibitors = await db.show.exhibitor.fuzzySearch(
        searchParams.text,
        {
          select: {
            id: true,
            isOrganizersFavorite: true,
            isRisingStar: true,
            logoPath: true,
            name: true,

            sponsorship: { select: { category: true } },
          },
          take: MAX_HIT_COUNT,
        },
      )

      const items = exhibitors.map((exhibitor) => ({
        type: Entity.Enum.EXHIBITOR,
        ...exhibitor,
      }))

      return json({ items })
    }

    case Entity.Enum.FOSTER_FAMILY: {
      const fosterFamilies = await db.fosterFamily.fuzzySearch(
        searchParams.text,
        {
          select: {
            availability: true,
            city: true,
            displayName: true,
            zipCode: true,
          },
          take: MAX_HIT_COUNT,
        },
      )

      const items = fosterFamilies.map((fosterFamily) => ({
        type: Entity.Enum.FOSTER_FAMILY,
        ...fosterFamily,
      }))

      return json({ items })
    }

    default: {
      return entity satisfies never
    }
  }
}

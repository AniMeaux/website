import { UserGroup } from "@animeaux/prisma"
import { zu } from "@animeaux/zod-utils"
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"

import { ActionFormData, AnimalPicturesForm } from "#i/animals/pictures/form.js"
import { getAnimalDisplayName } from "#i/animals/profile/name.js"
import {
  CloudinaryUploadApiError,
  createCloudinaryUploadHandler,
} from "#i/core/cloudinary.server.js"
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { db } from "#i/core/db.server.js"
import { NotFoundError } from "#i/core/errors.server.js"
import { assertIsDefined } from "#i/core/is-defined.server.js"
import { Card } from "#i/core/layout/card.js"
import { PageLayout } from "#i/core/layout/page.js"
import { Routes, useBackIfPossible } from "#i/core/navigation.js"
import { getPageTitle } from "#i/core/page-title.js"
import { prisma } from "#i/core/prisma.server.js"
import { notFound } from "#i/core/response.server.js"
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js"

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
})

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ])

  const result = ParamsSchema.safeParse(params)
  if (!result.success) {
    throw notFound()
  }

  const animal = await prisma.animal.findUnique({
    where: { id: result.data.id },
    select: {
      alias: true,
      avatar: true,
      name: true,
      pictures: true,
    },
  })

  assertIsDefined(animal)

  return json({ animal })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal
  if (animal == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }]
  }

  return [
    {
      title: getPageTitle([
        `Modifier ${getAnimalDisplayName(animal)}`,
        "Photos",
      ]),
    },
  ]
}

type ActionData = {
  redirectTo?: string
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>
}

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ])

  const paramsResult = ParamsSchema.safeParse(params)
  if (!paramsResult.success) {
    throw notFound()
  }

  try {
    const rawFormData = await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        createCloudinaryUploadHandler({
          filter: ({ name }) => name === ActionFormData.keys.pictures,
        }),
        unstable_createMemoryUploadHandler({
          filter: ({ contentType }) => contentType == null,
        }),
      ),
    )

    const formData = ActionFormData.safeParse(rawFormData)
    if (!formData.success) {
      return json<ActionData>(
        { errors: formData.error.flatten() },
        { status: 400 },
      )
    }

    const avatar = formData.data.pictures[0]
    invariant(avatar != null, "The avatar should exists")

    await db.animal.picture.update(
      paramsResult.data.id,
      {
        avatar,
        pictures: formData.data.pictures.slice(1),
      },
      currentUser,
    )
  } catch (error) {
    if (error instanceof CloudinaryUploadApiError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [error.message],
            fieldErrors: {},
          },
        },
        { status: error.status },
      )
    }

    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["L’animal est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 },
      )
    }

    throw error
  }

  return json<ActionData>({
    redirectTo: Routes.animals.id(paramsResult.data.id).toString(),
  })
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  const { animal } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>()
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo })

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-60">
          <Card.Header>
            <Card.Title>Modifier {animal.name}</Card.Title>
          </Card.Header>

          <Card.Content>
            <AnimalPicturesForm defaultAnimal={animal} fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout.Root>
  )
}

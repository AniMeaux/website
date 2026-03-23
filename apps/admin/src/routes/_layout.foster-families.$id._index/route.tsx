import { FormDataDelegate } from "@animeaux/form-data"
import type { FosterFamily } from "@animeaux/prisma"
import { FosterFamilyAvailability, UserGroup } from "@animeaux/prisma"
import { zu } from "@animeaux/zod-utils"
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { promiseHash } from "remix-utils/promise"

import { AnimalItem } from "#i/animals/item.js"
import { AnimalSearchParams } from "#i/animals/search-params.js"
import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { SimpleEmpty } from "#i/core/data-display/empty.js"
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js"
import { ErrorsInlineHelper } from "#i/core/data-display/errors.js"
import { BlockHelper, InlineHelper } from "#i/core/data-display/helper.js"
import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown.js"
import { db } from "#i/core/db.server.js"
import { NotFoundError, ReferencedError } from "#i/core/errors.server.js"
import { assertIsDefined } from "#i/core/is-defined.server.js"
import { AvatarCard } from "#i/core/layout/avatar-card.js"
import { Card } from "#i/core/layout/card.js"
import { PageLayout } from "#i/core/layout/page.js"
import { Routes } from "#i/core/navigation.js"
import { getPageTitle } from "#i/core/page-title.js"
import { Dialog } from "#i/core/popovers/dialog.js"
import { prisma } from "#i/core/prisma.server.js"
import { badRequest, notFound } from "#i/core/response.server.js"
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js"
import {
  AVATAR_COLOR_BY_AVAILABILITY,
  FosterFamilyAvatar,
} from "#i/foster-families/avatar.js"
import { ActionFormData } from "#i/foster-families/form.js"

import { ContactCard } from "./contact-card.js"
import { SituationCard } from "./situation-card.js"

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
})

export type loader = typeof loader

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ])

  const paramsResult = ParamsSchema.safeParse(params)
  if (!paramsResult.success) {
    throw notFound()
  }

  const { fosterFamily, fosterAnimalCount, fosterAnimals } = await promiseHash({
    fosterFamily: prisma.fosterFamily.findUnique({
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
        id: true,
        isBanned: true,
        phone: true,
        speciesAlreadyPresent: true,
        speciesToHost: true,
        zipCode: true,
      },
    }),

    fosterAnimalCount: prisma.animal.count({
      where: { fosterFamilyId: paramsResult.data.id },
    }),

    fosterAnimals: prisma.animal.findMany({
      where: { fosterFamilyId: paramsResult.data.id },
      take: 5,
      orderBy: { pickUpDate: "desc" },
      select: {
        alias: true,
        avatar: true,
        birthdate: true,
        gender: true,
        id: true,
        isSterilizationMandatory: true,
        isSterilized: true,
        manager: { select: { displayName: true } },
        name: true,
        nextVaccinationDate: true,
        species: true,
        status: true,
      },
    }),
  })

  assertIsDefined(fosterFamily)

  return json({ fosterFamily, fosterAnimalCount, fosterAnimals })
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily
  if (fosterFamily == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }]
  }

  return [{ title: getPageTitle(fosterFamily.displayName) }]
}

const BanActionFormData = FormDataDelegate.create(
  zu.object({
    isBanned: zu.checkbox(),
  }),
)

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

  if (request.method.toUpperCase() === "DELETE") {
    return await actionDelete({
      fosterFamilyId: paramsResult.data.id,
      currentUser,
    })
  }

  return await actionBan({
    fosterFamilyId: paramsResult.data.id,
    request,
    currentUser,
  })
}

type ActionData = {
  errors?: string[]
}

async function actionDelete({
  fosterFamilyId,
  currentUser,
}: {
  fosterFamilyId: FosterFamily["id"]
  currentUser: { id: string }
}) {
  try {
    await db.fosterFamily.delete(fosterFamilyId, currentUser)
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound()
    }

    if (error instanceof ReferencedError) {
      return json(
        {
          errors: [
            "La famille d’accueil ne peut être supprimée tant qu’elle a des animaux accueillis.",
          ],
        },
        { status: 400 },
      )
    }

    throw error
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing foster family.
  throw redirect(Routes.fosterFamilies.toString())
}

async function actionBan({
  fosterFamilyId,
  currentUser,
  request,
}: Pick<ActionFunctionArgs, "request"> & {
  fosterFamilyId: FosterFamily["id"]
  currentUser: { id: string }
}) {
  const formData = BanActionFormData.safeParse(await request.formData())
  if (!formData.success) {
    throw badRequest()
  }

  try {
    await db.fosterFamily.update(
      fosterFamilyId,
      { isBanned: formData.data.isBanned },
      currentUser,
    )
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound()
    }

    throw error
  }

  return json<ActionData>({})
}

export function ErrorBoundary() {
  return <ErrorPage />
}

export default function Route() {
  const { fosterFamily } = useLoaderData<typeof loader>()

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        {fosterFamily.isBanned ? (
          <BlockHelper variant="warning" icon="icon-ban-solid">
            {fosterFamily.displayName} est actuellement banni.
          </BlockHelper>
        ) : null}
        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <ContactCard />
          <SituationCard />
          <CommentsCard />
          <FosterAnimalsCard />
          <ActionsCard />
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <ContactCard />
            <FosterAnimalsCard />
          </section>

          <section className="md:flex md:flex-col md:gap-2">
            <SituationCard />
            <CommentsCard />
            <ActionsCard />
          </section>
        </section>
      </PageLayout.Content>
    </PageLayout.Root>
  )
}

function HeaderCard() {
  const { fosterFamily } = useLoaderData<typeof loader>()

  return (
    <AvatarCard>
      <AvatarCard.BackgroundColor
        color={AVATAR_COLOR_BY_AVAILABILITY[fosterFamily.availability]}
      />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <FosterFamilyAvatar
            size="lg"
            availability={fosterFamily.availability}
          />
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <h1>{fosterFamily.displayName}</h1>
          </AvatarCard.FirstLine>
        </AvatarCard.Lines>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </AvatarCard.Content>
    </AvatarCard>
  )
}

function CommentsCard() {
  const { fosterFamily } = useLoaderData<typeof loader>()

  if (fosterFamily.comments == null) {
    return null
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Commentaires privés</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={{
              pathname: Routes.fosterFamilies
                .id(fosterFamily.id)
                .edit.toString(),
              hash: ActionFormData.keys.comments,
            }}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <Markdown components={ARTICLE_COMPONENTS}>
          {fosterFamily.comments}
        </Markdown>
      </Card.Content>
    </Card>
  )
}

function FosterAnimalsCard() {
  const { fosterFamily, fosterAnimalCount, fosterAnimals } =
    useLoaderData<typeof loader>()

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {fosterAnimalCount === 0
            ? "Animaux accueillis"
            : fosterAnimalCount > 1
              ? `${fosterAnimalCount} animaux accueillis`
              : "1 animal accueillis"}
        </Card.Title>

        {fosterAnimalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.animals.toString(),
                search: AnimalSearchParams.format({
                  fosterFamiliesId: new Set([fosterFamily.id]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasHorizontalScroll={fosterAnimalCount > 0}>
        {fosterAnimalCount === 0 ? (
          <SimpleEmpty
            isCompact
            icon="🏡"
            iconAlt="Maison avec jardin"
            title="Aucun animal accueilli"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <>
            {fosterFamily.availability === FosterFamilyAvailability.AVAILABLE &&
            fosterFamily.availabilityExpirationDate != null ? (
              <span className="grid grid-cols-1 px-1.5 md:px-2">
                <InlineHelper variant="warning" icon="icon-clock-solid">
                  {fosterFamily.displayName} ne sera plus disponible à partir du{" "}
                  {DateTime.fromISO(fosterFamily.availabilityExpirationDate)
                    .plus({ days: 1 })
                    .toLocaleString(DateTime.DATE_FULL)}
                  .
                </InlineHelper>
              </span>
            ) : null}

            <ul className="flex">
              {fosterAnimals.map((animal) => (
                <li
                  key={animal.id}
                  className="flex flex-none flex-col first:pl-1 last:pr-1 md:first:pl-1 md:last:pr-1"
                >
                  <AnimalItem
                    animal={animal}
                    imageSizeMapping={{ default: "150px" }}
                    className="w-[160px] md:w-[170px]"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </Card.Content>
    </Card>
  )
}

function ActionsCard() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Actions</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-1">
          <ActionBan />
          <ActionDelete />
        </div>
      </Card.Content>
    </Card>
  )
}

function ActionBan() {
  const { fosterFamily } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>()
  const [isDialogOpened, setIsDialogOpened] = useState(false)

  const done = fetcher.state === "idle" && fetcher.data != null
  useEffect(() => {
    if (done) {
      setIsDialogOpened(false)
    }
  }, [done])

  return (
    <Dialog open={isDialogOpened} onOpenChange={setIsDialogOpened}>
      <Dialog.Trigger asChild>
        <Action variant="secondary" color="orange">
          <Action.Icon href="icon-ban-solid" />
          {fosterFamily.isBanned ? "Débannir" : "Bannir"}
        </Action>
      </Dialog.Trigger>

      <Dialog.Content variant="warning">
        <Dialog.Header>
          {fosterFamily.isBanned ? "Débannir" : "Bannir"}{" "}
          {fosterFamily.displayName}
        </Dialog.Header>

        <Dialog.Message>
          Êtes-vous sûr de vouloir{" "}
          {fosterFamily.isBanned ? "débannir" : "bannir"}{" "}
          <strong className="text-body-emphasis">
            {fosterFamily.displayName}
          </strong>
          {" "}?
        </Dialog.Message>

        <ErrorsInlineHelper errors={fetcher.data?.errors} />

        <Dialog.Actions>
          <Dialog.CloseAction>Annuler</Dialog.CloseAction>

          <fetcher.Form method="POST" className="flex">
            {!fosterFamily.isBanned ? (
              <input
                type="hidden"
                name={BanActionFormData.keys.isBanned}
                value="on"
              />
            ) : null}

            <Dialog.ConfirmAction type="submit">
              Oui, {fosterFamily.isBanned ? "débannir" : "bannir"}
            </Dialog.ConfirmAction>
          </fetcher.Form>
        </Dialog.Actions>
      </Dialog.Content>
    </Dialog>
  )
}

function ActionDelete() {
  const { fosterFamily, fosterAnimalCount } = useLoaderData<typeof loader>()
  const canDelete = fosterAnimalCount === 0
  const fetcher = useFetcher<typeof action>()
  const [isHelperVisible, setIsHelperVisible] = useState(false)

  return (
    <>
      {isHelperVisible ? (
        <InlineHelper
          variant="info"
          action={
            <button onClick={() => setIsHelperVisible(false)}>Fermer</button>
          }
        >
          La famille d’accueil ne peut être supprimée tant qu’elle a des animaux
          accueillis.
        </InlineHelper>
      ) : null}

      <Dialog>
        <Dialog.Trigger
          asChild
          onClick={
            canDelete
              ? undefined
              : (event) => {
                  // Don't open de dialog.
                  event.preventDefault()

                  setIsHelperVisible(true)
                }
          }
        >
          <Action variant="secondary" color="red">
            <Action.Icon href="icon-trash-solid" />
            Supprimer
          </Action>
        </Dialog.Trigger>

        <Dialog.Content variant="alert">
          <Dialog.Header>Supprimer {fosterFamily.displayName}</Dialog.Header>

          <Dialog.Message>
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong className="text-body-emphasis">
              {fosterFamily.displayName}
            </strong>
            {" "}?
            <br />
            L’action est irréversible.
          </Dialog.Message>

          <ErrorsInlineHelper errors={fetcher.data?.errors} />

          <Dialog.Actions>
            <Dialog.CloseAction>Annuler</Dialog.CloseAction>

            <fetcher.Form method="DELETE" className="flex">
              <Dialog.ConfirmAction type="submit">
                Oui, supprimer
              </Dialog.ConfirmAction>
            </fetcher.Form>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  )
}

import { cn } from "@animeaux/core"
import { UserGroup } from "@animeaux/prisma"
import { useOptimisticSearchParams } from "@animeaux/search-params-io"
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { promiseHash } from "remix-utils/promise"

import { Action } from "#i/core/actions.js"
import { BaseLink } from "#i/core/base-link.js"
import { Paginator } from "#i/core/controllers/paginator.js"
import { SortAndFiltersFloatingAction } from "#i/core/controllers/sort-and-filters-floating-action.js"
import { Chip } from "#i/core/data-display/chip.js"
import { SimpleEmpty } from "#i/core/data-display/empty.js"
import { toRoundedRelative } from "#i/core/dates.js"
import { db } from "#i/core/db.server.js"
import { Card } from "#i/core/layout/card.js"
import { PageLayout } from "#i/core/layout/page.js"
import { Routes } from "#i/core/navigation.js"
import { getPageTitle } from "#i/core/page-title.js"
import { prisma } from "#i/core/prisma.server.js"
import { PageSearchParams } from "#i/core/search-params.js"
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js"
import { Icon } from "#i/generated/icon.js"
import { UserAvatar } from "#i/users/avatar.js"
import { UserFilterForm } from "#i/users/filter-form.js"
import { GROUP_ICON } from "#i/users/groups.js"
import { UserSearchParams } from "#i/users/search-params.js"

const USER_COUNT_PER_PAGE = 20

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  })

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN])

  const searchParams = new URL(request.url).searchParams
  const pageSearchParams = PageSearchParams.parse(searchParams)
  const userSearchParams = UserSearchParams.parse(searchParams)

  const { where, orderBy } =
    await db.user.createFindManyParams(userSearchParams)

  const { userCount, users } = await promiseHash({
    userCount: prisma.user.count({ where }),

    users: prisma.user.findMany({
      skip: pageSearchParams.page * USER_COUNT_PER_PAGE,
      take: USER_COUNT_PER_PAGE,
      orderBy,
      where,
      select: {
        displayName: true,
        groups: true,
        id: true,
        isDisabled: true,
        lastActivityAt: true,
      },
    }),
  })

  const pageCount = Math.ceil(userCount / USER_COUNT_PER_PAGE)

  return json({ pageCount, userCount, users })
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Utilisateurs") }]
}

export default function Route() {
  const { pageCount, userCount, users } = useLoaderData<typeof loader>()
  const [searchParams] = useOptimisticSearchParams()

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="flex flex-col gap-1 md:flex-row md:gap-2">
          <section className="flex flex-col md:min-w-0 md:flex-2 md:shrink-2">
            <Card>
              <Card.Header>
                <Card.Title>
                  {userCount} {userCount > 1 ? "utilisateurs" : "utilisateur"}
                </Card.Title>

                <Action asChild variant="text">
                  <BaseLink to={Routes.users.new.toString()}>Créer</BaseLink>
                </Action>
              </Card.Header>

              <Card.Content hasListItems>
                {users.length > 0 ? (
                  <ul className="grid grid-cols-1">
                    {users.map((user) => (
                      <li key={user.id} className="flex">
                        <UserItem user={user} className="w-full" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SimpleEmpty
                    isCompact
                    icon="👻"
                    iconAlt="Fantôme"
                    title="Aucun utilisateur trouvé"
                    message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                    titleElementType="h3"
                    action={
                      !UserSearchParams.isEmpty(searchParams) ? (
                        <Action asChild>
                          <BaseLink to={{ search: "" }}>
                            Effacer les filtres
                          </BaseLink>
                        </Action>
                      ) : null
                    }
                  />
                )}
              </Card.Content>

              {pageCount > 1 ? (
                <Card.Footer>
                  <Paginator pageCount={pageCount} />
                </Card.Footer>
              ) : null}
            </Card>
          </section>

          <aside className="hidden max-w-30 min-w-25 flex-1 flex-col md:flex">
            <Card className="sticky top-[calc(20px+var(--header-height))] max-h-[calc(100vh-40px-var(--header-height))]">
              <Card.Header>
                <Card.Title>Trier et filtrer</Card.Title>
              </Card.Header>

              <Card.Content hasVerticalScroll>
                <UserFilterForm />
              </Card.Content>
            </Card>
          </aside>
        </section>

        <SortAndFiltersFloatingAction hasSort totalCount={userCount}>
          <UserFilterForm />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout.Root>
  )
}

function UserItem({
  user,
  className,
}: {
  user: SerializeFrom<typeof loader>["users"][number]
  className?: string
}) {
  return (
    <BaseLink
      to={Routes.users.id(user.id).toString()}
      className={cn(
        className,
        "grid grid-flow-col grid-cols-auto-fr items-start gap-1 rounded-0.5 bg-white px-0.5 py-1 hover:bg-gray-100 focus-visible:z-10 focus-visible:focus-ring md:gap-2 md:px-1",
      )}
    >
      <UserAvatar user={user} size="sm" />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{user.displayName}</span>

        <span className="text-gray-500">
          {user.lastActivityAt == null
            ? "Aucune activité"
            : `Actif ${toRoundedRelative(user.lastActivityAt)}`}
        </span>
      </span>

      {user.isDisabled ? (
        <Chip
          variant="primary"
          color="orange"
          icon="icon-ban-solid"
          title="Bloqué"
        />
      ) : null}

      <span
        className="flex h-2 items-center gap-0.5 icon-2 text-gray-500"
        title="Groupes"
      >
        {user.groups.map((group) => (
          <Icon key={group} href={GROUP_ICON[group]} />
        ))}
      </span>
    </BaseLink>
  )
}

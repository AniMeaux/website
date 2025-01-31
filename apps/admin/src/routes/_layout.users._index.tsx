import { Action } from "#core/actions";
import { algolia } from "#core/algolia/algolia.server";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { Chip } from "#core/data-display/chip";
import { SimpleEmpty } from "#core/data-display/empty";
import { toRoundedRelative } from "#core/dates";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { Icon } from "#generated/icon";
import { UserAvatar } from "#users/avatar";
import { UserFilterForm } from "#users/filter-form";
import { GROUP_ICON } from "#users/groups";
import { UserSearchParams, UserSort } from "#users/search-params";
import { cn } from "@animeaux/core";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils/promise";

const USER_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const userSearchParams = UserSearchParams.parse(searchParams);

  const where: Prisma.UserWhereInput[] = [];
  if (userSearchParams.groups.size > 0) {
    where.push({ groups: { hasSome: Array.from(userSearchParams.groups) } });
  }

  if (
    userSearchParams.lastActivityStart != null ||
    userSearchParams.lastActivityEnd != null
  ) {
    const lastActivityAt: Prisma.DateTimeFilter = {};

    if (userSearchParams.lastActivityStart != null) {
      lastActivityAt.gte = userSearchParams.lastActivityStart;
    }

    if (userSearchParams.lastActivityEnd != null) {
      lastActivityAt.lte = DateTime.fromJSDate(userSearchParams.lastActivityEnd)
        .endOf("day")
        .toJSDate();
    }

    where.push({ lastActivityAt });
  }

  if (userSearchParams.noActivity) {
    where.push({ lastActivityAt: null });
  }

  if (userSearchParams.displayName != null) {
    const users = await algolia.user.findMany({
      where: {
        displayName: userSearchParams.displayName,
        groups: userSearchParams.groups,
      },
    });

    where.push({ id: { in: users.map((user) => user.id) } });
  }

  const { userCount, users } = await promiseHash({
    userCount: prisma.user.count({ where: { AND: where } }),

    users: prisma.user.findMany({
      skip: pageSearchParams.page * USER_COUNT_PER_PAGE,
      take: USER_COUNT_PER_PAGE,
      orderBy: USER_ORDER_BY[userSearchParams.sort],
      where: { AND: where },
      select: {
        displayName: true,
        groups: true,
        id: true,
        isDisabled: true,
        lastActivityAt: true,
      },
    }),
  });

  const pageCount = Math.ceil(userCount / USER_COUNT_PER_PAGE);

  return json({ pageCount, userCount, users });
}

const USER_ORDER_BY: Record<UserSort, Prisma.UserFindManyArgs["orderBy"]> = {
  [UserSort.NAME]: { displayName: "asc" },
  [UserSort.LAST_ACTIVITY]: { lastActivityAt: "desc" },
};

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Utilisateurs") }];
};

export default function Route() {
  const { pageCount, userCount, users } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="flex flex-col gap-1 md:flex-row md:gap-2">
          <section className="flex flex-col md:min-w-0 md:flex-2">
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

          <aside className="hidden min-w-[250px] max-w-[300px] flex-1 flex-col md:flex">
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
  );
}

function UserItem({
  user,
  className,
}: {
  user: SerializeFrom<typeof loader>["users"][number];
  className?: string;
}) {
  return (
    <BaseLink
      to={Routes.users.id(user.id).toString()}
      className={cn(
        className,
        "grid grid-flow-col grid-cols-[auto_minmax(0px,1fr)] items-start gap-1 rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:gap-2 md:px-1",
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
        className="flex h-2 items-center gap-0.5 text-[20px] text-gray-500"
        title="Groupes"
      >
        {user.groups.map((group) => (
          <Icon key={group} href={GROUP_ICON[group]} />
        ))}
      </span>
    </BaseLink>
  );
}

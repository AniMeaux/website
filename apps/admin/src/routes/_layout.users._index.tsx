import { Action } from "#core/actions.tsx";
import { algolia } from "#core/algolia/algolia.server.ts";
import { BaseLink } from "#core/baseLink.tsx";
import { Paginator } from "#core/controllers/paginator.tsx";
import { SortAndFiltersFloatingAction } from "#core/controllers/sortAndFiltersFloatingAction.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { db } from "#core/db.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { UserFilterForm } from "#users/filterForm.tsx";
import { UserItem } from "#users/item.tsx";
import { UserSearchParams, UserSort } from "#users/searchParams.ts";
import { Prisma, UserGroup } from "@prisma/client";
import { LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";

const USER_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
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
    const users = await algolia.user.search({
      displayName: userSearchParams.displayName,
      groups: userSearchParams.groups,
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

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Utilisateurs") }];
};

export default function Route() {
  const { pageCount, userCount, users } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout>
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

              <Card.Content>
                {users.length > 0 ? (
                  <ul className="grid grid-cols-1">
                    {users.map((user) => (
                      <li key={user.id} className="flex">
                        <UserItem user={user} className="w-full" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Empty
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

          <aside className="hidden flex-col min-w-[250px] max-w-[300px] flex-1 md:flex">
            <Card className="sticky top-8 max-h-[calc(100vh-100px)]">
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
    </PageLayout>
  );
}

import { Prisma, User, UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import orderBy from "lodash.orderby";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";
import { Action } from "~/core/actions";
import { algolia } from "~/core/algolia/algolia.server";
import { BaseLink } from "~/core/baseLink";
import { Paginator } from "~/core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "~/core/controllers/sortAndFiltersFloatingAction";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "~/core/searchParams";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { UserFilterForm } from "~/users/filterForm";
import { UserItem } from "~/users/item";
import { UserSearchParams } from "~/users/searchParams";

const USER_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = new PageSearchParams(searchParams);
  const userSearchParams = new UserSearchParams(searchParams);

  const where: Prisma.UserWhereInput[] = [];
  const groups = userSearchParams.getGroups();
  if (groups.length > 0) {
    where.push({ groups: { hasSome: groups } });
  }

  const minActivity = userSearchParams.getMinActivity();
  const maxActivity = userSearchParams.getMaxActivity();
  if (minActivity != null || maxActivity != null) {
    const lastActivityAt: Prisma.DateTimeFilter = {};

    if (minActivity != null) {
      lastActivityAt.gte = minActivity;
    }

    if (maxActivity != null) {
      lastActivityAt.lte = DateTime.fromJSDate(maxActivity)
        .endOf("day")
        .toJSDate();
    }

    where.push({ lastActivityAt });
  }

  const noActivity = userSearchParams.getNoActivity();
  if (noActivity) {
    where.push({ lastActivityAt: null });
  }

  const displayName = userSearchParams.getDisplayName();
  let rankedUserId: User["id"][] = [];
  if (displayName != null) {
    const users = await algolia.user.search({ displayName, groups });
    rankedUserId = users.map((user) => user.id);
    where.push({ id: { in: rankedUserId } });
  }

  const sort = userSearchParams.getSort();

  let { userCount, users } = await promiseHash({
    userCount: prisma.user.count({ where: { AND: where } }),

    users: prisma.user.findMany({
      skip: pageSearchParams.getPage() * USER_COUNT_PER_PAGE,
      take: USER_COUNT_PER_PAGE,
      orderBy:
        sort === UserSearchParams.Sort.LAST_ACTIVITY
          ? { lastActivityAt: "desc" }
          : sort === UserSearchParams.Sort.NAME || displayName == null
          ? { displayName: "asc" }
          : undefined,
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

  if (sort === UserSearchParams.Sort.RELEVANCE && rankedUserId.length > 0) {
    users = orderBy(users, (user) =>
      rankedUserId.findIndex((userId) => user.id === userId)
    );
  }

  const pageCount = Math.ceil(userCount / USER_COUNT_PER_PAGE);

  return json({ pageCount, userCount, users });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Utilisateurs") };
};

export default function Route() {
  const { pageCount, userCount, users } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();
  const userSearchParams = new UserSearchParams(searchParams);

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
                  <BaseLink to="./new">Créer</BaseLink>
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
                      !userSearchParams.isEmpty() ? (
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

        <SortAndFiltersFloatingAction totalCount={userCount}>
          <UserFilterForm />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout>
  );
}

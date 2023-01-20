import { Prisma, UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";
import { z } from "zod";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import { ACTIVE_ANIMAL_STATUS } from "~/animals/status";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
import { Empty } from "~/core/dataDisplay/empty";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { Helper } from "~/core/dataDisplay/helper";
import { Item } from "~/core/dataDisplay/item";
import { toRoundedRelative } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent, PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { GROUP_ICON, GROUP_TRANSLATION, hasGroups } from "~/users/groups";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const managedAnimalsWhere: Prisma.AnimalWhereInput = {
    managerId: result.data,
    status: { in: ACTIVE_ANIMAL_STATUS },
  };

  const { user, managedAnimalCount, managedAnimals } = await promiseHash({
    user: prisma.user.findUnique({
      where: { id: result.data },
      select: {
        id: true,
        displayName: true,
        email: true,
        groups: true,
        isDisabled: true,
        lastActivityAt: true,
      },
    }),

    managedAnimalCount: prisma.animal.count({ where: managedAnimalsWhere }),

    managedAnimals: prisma.animal.findMany({
      where: managedAnimalsWhere,
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
        name: true,
        nextVaccinationDate: true,
        species: true,
        status: true,
      },
    }),
  });

  assertIsDefined(user);

  return json({ user, managedAnimalCount, managedAnimals });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const user = data?.user;
  if (user == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(user.displayName) };
};

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageContent className="flex flex-col gap-1 md:gap-2">
        {user.isDisabled ? (
          <Helper isBlock variant="warning" icon="ban">
            {user.displayName} est actuellement bloqué.
          </Helper>
        ) : null}

        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <ActivityCard />
          <GroupsCard />
          <ManagerCard />
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <ManagerCard />
          </section>

          <section className="md:flex md:flex-col md:gap-2">
            <ActivityCard />
            <GroupsCard />
          </section>
        </section>
      </PageContent>
    </PageLayout>
  );
}

function HeaderCard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Card>
      <div
        className={cn(
          "h-6 flex md:h-10",
          USER_BG_COLOR[inferAvatarColor(user.id)]
        )}
      />

      <CardContent>
        <div className="relative pt-1 pl-9 grid grid-cols-1 grid-flow-col gap-1 md:pt-2 md:pl-10 md:gap-2">
          <UserAvatar
            user={user}
            size="xl"
            className="absolute bottom-0 left-0 ring-5 ring-white"
          />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-title-section-small md:text-title-section-large">
              {user.displayName}
            </h1>

            <div>{user.email}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const USER_BG_COLOR: Record<AvatarColor, string> = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  red: "bg-red-50",
  yellow: "bg-yellow-50",
};

function ActivityCard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          <Item icon={<Icon id="wavePulse" />}>
            {user.lastActivityAt == null ? (
              "Aucune activité"
            ) : (
              <>
                Actif{" "}
                <strong className="text-body-emphasis">
                  {toRoundedRelative(user.lastActivityAt)}
                </strong>
              </>
            )}
          </Item>
        </ul>
      </CardContent>
    </Card>
  );
}

function GroupsCard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groupes</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          {user.groups.map((group) => (
            <Item key={group} icon={<Icon id={GROUP_ICON[group]} />}>
              {GROUP_TRANSLATION[group]}
            </Item>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ManagerCard() {
  const { user, managedAnimalCount, managedAnimals } =
    useLoaderData<typeof loader>();
  const isManager = hasGroups(user, [UserGroup.ANIMAL_MANAGER]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {managedAnimalCount === 0
            ? "À sa charge"
            : managedAnimalCount > 1
            ? `${managedAnimalCount} animaux à sa charge`
            : "1 animal à sa charge"}
        </CardTitle>

        {managedAnimalCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setStatuses(ACTIVE_ANIMAL_STATUS)
                .setManagersId([user.id])
                .toString(),
            }}
            className={actionClassName.standalone({ variant: "text" })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent hasHorizontalScroll={managedAnimalCount > 0}>
        {managedAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="🦤"
            iconAlt="Dodo bird"
            title="Aucun animal à sa charge"
            titleElementType="h3"
            message={
              isManager ? (
                "Pour l’instant ;)"
              ) : (
                <>
                  Seuls les membres du group{" "}
                  <strong className="text-body-emphasis">
                    {GROUP_TRANSLATION[UserGroup.ANIMAL_MANAGER]}
                  </strong>{" "}
                  peuvent avoir des animaux à leur charge.
                </>
              )
            }
          />
        ) : (
          <ul className="flex gap-1">
            {managedAnimals.map((animal) => (
              <li
                key={animal.id}
                className="flex-none flex flex-col first:pl-1 last:pr-1 md:first:pl-2 md:last:pr-2"
              >
                <AnimalItem
                  animal={animal}
                  imageSizes={{ default: "300px" }}
                  className="w-[150px]"
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

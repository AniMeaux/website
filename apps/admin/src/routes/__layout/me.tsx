import { Prisma, UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import {
  ACTIVE_ANIMAL_STATUS,
  NON_ACTIVE_ANIMAL_STATUS,
} from "~/animals/status";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { inferAvatarColor } from "~/core/dataDisplay/avatar";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import { AvatarCard } from "~/core/layout/avatarCard";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent, PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { getCurrentUser } from "~/currentUser/db.server";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { GROUP_ICON, GROUP_TRANSLATION, hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, displayName: true, email: true, groups: true },
  });

  const managedAnimalsWhere: Prisma.AnimalWhereInput = {
    managerId: currentUser.id,
    status: { in: ACTIVE_ANIMAL_STATUS },
  };

  const nonActiveManagedAnimalsWhere: Prisma.AnimalWhereInput = {
    managerId: currentUser.id,
    status: { in: NON_ACTIVE_ANIMAL_STATUS },
  };

  const {
    managedAnimalCount,
    managedAnimals,
    nonActiveManagedAnimalCount,
    nonActiveManagedAnimals,
  } = await promiseHash({
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

    nonActiveManagedAnimalCount: prisma.animal.count({
      where: nonActiveManagedAnimalsWhere,
    }),
    nonActiveManagedAnimals: prisma.animal.findMany({
      where: nonActiveManagedAnimalsWhere,
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

  return json({
    currentUser,
    managedAnimalCount,
    managedAnimals,
    nonActiveManagedAnimalCount,
    nonActiveManagedAnimals,
  });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Mon profil") };
};

export default function Route() {
  return (
    <PageLayout>
      <PageContent className="flex flex-col gap-1 md:gap-2">
        <HeaderCard />

        <section className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <aside className="flex flex-col gap-1 md:hidden">
            <GroupCard />
          </aside>

          <section className="flex flex-col gap-1 md:gap-2">
            <ManagedAnimalsCard />
            <NonActiveManagedAnimalsCard />
          </section>

          <aside className="flex flex-col gap-1 md:gap-2">
            <div className="hidden md:flex md:flex-col">
              <GroupCard />
            </div>

            <ActionsCard />
          </aside>
        </section>
      </PageContent>
    </PageLayout>
  );
}

function HeaderCard() {
  const { currentUser } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundColor color={inferAvatarColor(currentUser.id)} />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <UserAvatar user={currentUser} size="xl" />
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <h1>{currentUser.displayName}</h1>
          </AvatarCard.FirstLine>
          <AvatarCard.SecondLine>
            <p>{currentUser.email}</p>
          </AvatarCard.SecondLine>
        </AvatarCard.Lines>

        <BaseLink
          to="/me/edit-profile"
          className={actionClassName.standalone({ variant: "text" })}
        >
          Modifier
        </BaseLink>
      </AvatarCard.Content>
    </AvatarCard>
  );
}

function GroupCard() {
  const { currentUser } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groupes</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          {currentUser.groups.map((group) => (
            <li
              key={group}
              className="grid grid-cols-[auto_minmax(0px,1fr)] items-start"
            >
              <span className="w-4 h-4 flex items-center justify-center text-gray-600">
                <Icon id={GROUP_ICON[group]} />
              </span>

              <span className="py-1">{GROUP_TRANSLATION[group]}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
      </CardHeader>

      <CardContent>
        <BaseLink
          to="/me/change-password"
          className={actionClassName.standalone({
            variant: "secondary",
            color: "gray",
          })}
        >
          Changer de mot de passe
        </BaseLink>
      </CardContent>
    </Card>
  );
}

function ManagedAnimalsCard() {
  const { currentUser, managedAnimalCount, managedAnimals } =
    useLoaderData<typeof loader>();
  const isManager = hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {managedAnimalCount === 0
            ? "À votre charge"
            : managedAnimalCount > 1
            ? `${managedAnimalCount} animaux à votre charge`
            : "1 animal à votre charge"}
        </CardTitle>

        {managedAnimalCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setStatuses(ACTIVE_ANIMAL_STATUS)
                .setManagersId([currentUser.id])
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
            title="Aucun animal à votre charge"
            titleElementType="h3"
            message={
              isManager ? (
                "Pour l’instant ;)"
              ) : (
                <>
                  Seuls les membres du groupe{" "}
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

function NonActiveManagedAnimalsCard() {
  const { currentUser, nonActiveManagedAnimalCount, nonActiveManagedAnimals } =
    useLoaderData<typeof loader>();
  const isManager = hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {nonActiveManagedAnimalCount === 0
            ? "Animaux gérés et sortis"
            : nonActiveManagedAnimalCount > 1
            ? `${nonActiveManagedAnimalCount} animaux gérés et sortis`
            : "1 animal géré et sorti"}
        </CardTitle>

        {nonActiveManagedAnimalCount > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals/search",
              search: new AnimalSearchParams()
                .setStatuses(NON_ACTIVE_ANIMAL_STATUS)
                .setManagersId([currentUser.id])
                .toString(),
            }}
            className={actionClassName.standalone({ variant: "text" })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent hasHorizontalScroll={nonActiveManagedAnimalCount > 0}>
        {nonActiveManagedAnimalCount === 0 ? (
          <Empty
            isCompact
            icon="📭"
            iconAlt="Boîte aux lettres ouverte avec drapeau abaissé"
            title="Aucun animal géré et sorti"
            titleElementType="h3"
            message={
              isManager ? (
                "Pour l’instant ;)"
              ) : (
                <>
                  Seuls les membres du groupe{" "}
                  <strong className="text-body-emphasis">
                    {GROUP_TRANSLATION[UserGroup.ANIMAL_MANAGER]}
                  </strong>{" "}
                  peuvent gérer des animaux.
                </>
              )
            }
          />
        ) : (
          <ul className="flex gap-1">
            {nonActiveManagedAnimals.map((animal) => (
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

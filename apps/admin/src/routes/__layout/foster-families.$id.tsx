import { UserGroup } from "@prisma/client";
import { json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { AvatarColor, inferAvatarColor } from "~/core/dataDisplay/avatar";
import { Empty } from "~/core/dataDisplay/empty";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { Item } from "~/core/dataDisplay/item";
import { prisma } from "~/core/db.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { getLongLocation } from "~/fosterFamilies/location";
import { Icon } from "~/generated/icon";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const fosterFamily = await prisma.fosterFamily.findUnique({
    where: { id: result.data },
    select: {
      address: true,
      city: true,
      displayName: true,
      email: true,
      fosterAnimals: {
        take: 5,
        orderBy: { pickUpDate: "desc" },
        select: {
          alias: true,
          avatar: true,
          gender: true,
          id: true,
          name: true,
          status: true,
        },
      },
      id: true,
      phone: true,
      zipCode: true,
    },
  });

  assertIsDefined(fosterFamily);

  return json({ fosterFamily });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily;
  if (fosterFamily == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(fosterFamily.displayName) };
};

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function FosterFamilyProfilePage() {
  return (
    <main className="w-full flex flex-col gap-1 md:gap-2">
      <HeaderCard />

      <section className="grid grid-cols-1 gap-1 md:hidden">
        <section className="flex flex-col gap-1">
          <ProfileCard />
          <FosterAnimalsCard />
        </section>
      </section>

      <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <section className="md:flex md:flex-col md:gap-2">
          <ProfileCard />
          <FosterAnimalsCard />
        </section>
      </section>
    </main>
  );
}

function HeaderCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <div
        className={cn(
          "h-6 flex md:h-10",
          FOSTER_FAMILY_BG_COLOR[inferAvatarColor(fosterFamily.id)]
        )}
      />

      <CardContent>
        <div className="relative pt-1 pl-9 grid grid-cols-1 grid-flow-col gap-1 md:pt-2 md:pl-10 md:gap-2">
          <FosterFamilyAvatar
            fosterFamily={fosterFamily}
            size="xl"
            className="absolute bottom-0 left-0 ring-5 ring-white"
          />

          <div className="flex flex-col gap-0.5">
            <h1 className="text-title-section-small md:text-title-section-large">
              {fosterFamily.displayName}
            </h1>

            {/* To make sure we have the right height. */}
            <div> </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const FOSTER_FAMILY_BG_COLOR: Record<AvatarColor, string> = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  red: "bg-red-50",
  yellow: "bg-yellow-50",
};

function ProfileCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-col">
          <Item icon={<Icon id="phone" />}>{fosterFamily.phone}</Item>
          <Item icon={<Icon id="envelope" />}>{fosterFamily.email}</Item>
          <Item icon={<Icon id="locationDot" />}>
            {getLongLocation(fosterFamily)}
          </Item>
        </ul>
      </CardContent>
    </Card>
  );
}

function FosterAnimalsCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animaux accueillis</CardTitle>

        {fosterFamily.fosterAnimals.length > 0 ? (
          <BaseLink
            to={{
              pathname: "/animals",
              search: new AnimalSearchParams()
                .setFosterFamiliesId([fosterFamily.id])
                .toString(),
            }}
            className={actionClassName.standalone({ variant: "text" })}
          >
            Tout voir
          </BaseLink>
        ) : null}
      </CardHeader>

      <CardContent hasHorizontalScroll={fosterFamily.fosterAnimals.length > 0}>
        {fosterFamily.fosterAnimals.length === 0 ? (
          <Empty
            isCompact
            icon="🏡"
            iconAlt="Maison avec jardin"
            title="Aucun animal accueilli"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        ) : (
          <ul className="flex gap-1">
            {fosterFamily.fosterAnimals.map((animal) => (
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

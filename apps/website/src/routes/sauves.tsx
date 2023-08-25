import { AnimalItem } from "#animals/item.tsx";
import { SAVED_ANIMAL_STATUS } from "#animals/status.ts";
import { cn } from "#core/classNames.ts";
import { Paginator } from "#core/controllers/paginator.tsx";
import { prisma } from "#core/db.server.ts";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { getPage } from "#core/searchParams.ts";
import type { Prisma } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 18;

export async function loader({ request }: LoaderArgs) {
  const where: Prisma.AnimalWhereInput = {
    status: { in: SAVED_ANIMAL_STATUS },
  };

  const searchParams = new URL(request.url).searchParams;
  const page = getPage(searchParams);

  const { totalCount, animals } = await promiseHash({
    totalCount: prisma.animal.count({ where }),
    animals: prisma.animal.findMany({
      where,
      skip: page * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy: { pickUpDate: "desc" },
      select: {
        id: true,
        avatar: true,
        name: true,
        gender: true,
        birthdate: true,
        species: true,
        breed: { select: { name: true } },
        color: { select: { name: true } },
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / ANIMAL_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, animals });
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Animaux sauvés") });
};

export default function Route() {
  const { totalCount, pageCount, animals } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header
        className={cn(
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-12"
        )}
      >
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:flex-1 md:text-title-hero-large md:text-left"
          )}
        >
          Animaux sauvés
        </h1>
      </header>

      {totalCount > 0 ? (
        <>
          <h2 className={cn("text-gray-500 text-center", "md:text-left")}>
            {totalCount} {totalCount > 1 ? "animaux" : "animal"}
          </h2>

          <section className="flex">
            <ul
              className={cn(
                "w-full grid grid-cols-1 gap-12 items-start",
                "xs:grid-cols-2",
                "sm:grid-cols-3"
              )}
            >
              {animals.map((animal) => (
                <AnimalItem isDisabled key={animal.id} animal={animal} />
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p
          className={cn("py-12 text-center text-gray-500", "md:px-30 md:py-40")}
        >
          Aucun animal à sauvé pour l’instant
        </p>
      )}

      <Paginator pageCount={pageCount} className="self-center" />
    </main>
  );
}

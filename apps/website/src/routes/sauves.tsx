import { AnimalItem } from "#animals/item";
import { SAVED_ANIMAL_STATUS } from "#animals/status";
import { Paginator } from "#core/controllers/paginator";
import { prisma } from "#core/db.server";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { getPage } from "#core/search-params";
import { cn } from "@animeaux/core";
import type { Prisma } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 18;

export async function loader({ request }: LoaderFunctionArgs) {
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

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Animaux sauvés") });
};

export default function Route() {
  const { totalCount, pageCount, animals } = useLoaderData<typeof loader>();

  return (
    <main className="flex w-full flex-col gap-12 px-page">
      <header
        className={cn(
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-12",
        )}
      >
        <h1
          className={cn(
            "text-center text-title-hero-small",
            "md:flex-1 md:text-left md:text-title-hero-large",
          )}
        >
          Animaux sauvés
        </h1>
      </header>

      {totalCount > 0 ? (
        <>
          <h2 className={cn("text-center text-gray-500", "md:text-left")}>
            {totalCount} {totalCount > 1 ? "animaux" : "animal"}
          </h2>

          <section className="flex">
            <ul
              className={cn(
                "grid w-full grid-cols-1 items-start gap-12",
                "xs:grid-cols-2",
                "sm:grid-cols-3",
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

import { formatAge } from "@animeaux/shared";
import { Gender, Prisma } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SAVED_ANIMAL_STATUS } from "~/animals/status";
import { Paginator } from "~/controllers/paginator";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { isDefined } from "~/core/isDefined";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { getPage } from "~/core/searchParams";
import { GENDER_TRANSLATION, SPECIES_TRANSLATION } from "~/core/translations";
import { DynamicImage } from "~/dataDisplay/image";
import { Icon } from "~/generated/icon";

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 18;

const animalSelect = Prisma.validator<Prisma.AnimalArgs>()({
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
});

type Animal = Prisma.AnimalGetPayload<typeof animalSelect>;

type LoaderDataServer = {
  totalCount: number;
  pageCount: number;
  animals: Animal[];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const where: Prisma.AnimalWhereInput = {
    status: { in: SAVED_ANIMAL_STATUS },
  };

  const searchParams = new URL(request.url).searchParams;
  const page = getPage(searchParams);

  const [totalCount, animals] = await Promise.all([
    prisma.animal.count({ where }),
    prisma.animal.findMany({
      where,
      skip: page * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy: { pickUpDate: "desc" },
      select: animalSelect.select,
    }),
  ]);

  const pageCount = Math.ceil(totalCount / ANIMAL_COUNT_PER_PAGE);

  return json<LoaderDataServer>({ totalCount, pageCount, animals });
};

export const meta: MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Animaux sauvés") });
};

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function SavedPage() {
  const { totalCount, pageCount, animals } = useLoaderData<LoaderDataClient>();

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
            "px-4 text-title-hero-small text-center",
            "md:flex-1 md:px-0 md:text-title-hero-large md:text-left"
          )}
        >
          Animaux sauvés
        </h1>
      </header>

      {totalCount > 0 ? (
        <section className="flex flex-col gap-6">
          <h2 className={cn("text-gray-500 text-center", "md:text-left")}>
            {totalCount} {totalCount > 1 ? "animaux" : "animal"}
          </h2>

          <ul
            className={cn(
              "grid grid-cols-1 grid-rows-[auto] gap-6 items-start",
              "xs:grid-cols-2",
              "sm:grid-cols-3"
            )}
          >
            {animals.map((animal) => (
              <AnimalItem key={animal.id} animal={animal} />
            ))}
          </ul>
        </section>
      ) : (
        <p className={cn("px-4 py-12 text-center text-gray-500", "md:py-40")}>
          Aucun animal à sauvé pour l'instant
        </p>
      )}

      <Paginator pageCount={pageCount} className="self-center" />
    </main>
  );
}

function AnimalItem({
  animal,
}: {
  animal: LoaderDataClient["animals"][number];
}) {
  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ]
    .filter(isDefined)
    .join(" • ");

  return (
    <li className={cn("group w-full px-4 py-3 flex flex-col gap-3", "md:p-6")}>
      <DynamicImage
        imageId={animal.avatar}
        alt={animal.name}
        sizes={{ lg: "300px", md: "50vw", default: "100vw" }}
        fallbackSize="512"
        className="w-full aspect-4/3 flex-none rounded-bubble-ratio"
      />

      <div className="flex flex-col">
        <p className="flex items-start gap-1">
          <span
            className={cn("h-6 flex-none flex items-center text-[20px]", {
              "text-pink-500": animal.gender === Gender.FEMALE,
              "text-brandBlue": animal.gender === Gender.MALE,
            })}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon id={animal.gender === Gender.FEMALE ? "venus" : "mars"} />
          </span>

          <span className="flex-1 test-title-item">{animal.name}</span>
        </p>

        <p className="flex items-start gap-6 text-caption-default text-gray-500">
          <span className="flex-1">{speciesLabels}</span>
          <span className="flex-none">{formatAge(animal.birthdate)}</span>
        </p>
      </div>
    </li>
  );
}

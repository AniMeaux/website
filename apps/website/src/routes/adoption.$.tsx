import { AnimalItem } from "#animals/item.tsx";
import { ADOPTABLE_ANIMAL_STATUS } from "#animals/status.ts";
import { actionClassNames } from "#core/actions.ts";
import { BaseLink } from "#core/baseLink.tsx";
import { cn } from "#core/classNames.ts";
import { Paginator } from "#core/controllers/paginator.tsx";
import {
  AGES_TO_PATH,
  ANIMAL_AGES_BY_SPECIES,
  SPECIES_TO_PATH,
  SearchForm,
} from "#core/controllers/searchForm.tsx";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { prisma } from "#core/db.server.ts";
import { createSocialMeta } from "#core/meta.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { getPage } from "#core/searchParams.ts";
import {
  AGE_PLURAL_TRANSLATION,
  AGE_TRANSLATION,
  SPECIES_PLURAL_TRANSLATION,
  SPECIES_TRANSLATION,
} from "#core/translations.ts";
import type { AnimalAge } from "@animeaux/core";
import { ANIMAL_AGE_RANGE_BY_SPECIES } from "@animeaux/core";
import type { Prisma, Species } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";
import invariant from "tiny-invariant";

type PageParams = {
  species?: Species;
  age?: AnimalAge;
};

const PATH_TO_PAGE_PARAMS = createPathToPageParams();
function createPathToPageParams() {
  const map = new Map<string, PageParams>();

  // All species.
  map.set("", {});

  (Object.entries(ANIMAL_AGES_BY_SPECIES) as [Species, AnimalAge[]][]).forEach(
    ([species, ages]) => {
      const speciesPath = SPECIES_TO_PATH[species];

      // All ages for a species.
      map.set(speciesPath, { species });

      ages.forEach((age) => {
        // An age for a species.
        map.set(`${speciesPath}/${AGES_TO_PATH[age]}`, { species, age });
      });
    },
  );

  return map;
}

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 18;

export async function loader({ params, request }: LoaderArgs) {
  const pageParams = PATH_TO_PAGE_PARAMS.get(params["*"] ?? "");
  if (pageParams == null) {
    throw new Response("Not found", { status: 404 });
  }

  const where: Prisma.AnimalWhereInput = {
    status: { in: ADOPTABLE_ANIMAL_STATUS },
    species: pageParams.species,
    birthdate: getAgeRangeSearchFilter(pageParams.species, pageParams.age),
  };

  const searchParams = new URL(request.url).searchParams;
  const page = getPage(searchParams);

  const { totalCount, animals } = await promiseHash({
    totalCount: prisma.animal.count({ where }),
    animals: prisma.animal.findMany({
      where,
      skip: page * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy: { name: "asc" },
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

function getAgeRangeSearchFilter(
  species?: Species,
  age?: AnimalAge,
): NonNullable<Prisma.AnimalWhereInput["birthdate"]> | undefined {
  if (species == null || age == null) {
    return undefined;
  }

  const speciesAgeRanges = ANIMAL_AGE_RANGE_BY_SPECIES[species];
  if (speciesAgeRanges == null) {
    return undefined;
  }

  const ageRange = speciesAgeRanges[age];
  if (ageRange == null) {
    return undefined;
  }

  const now = DateTime.now();

  return {
    gt: now.minus({ months: ageRange.maxMonths }).toJSDate(),
    lte: now.minus({ months: ageRange.minMonths }).toJSDate(),
  };
}

export const meta: V2_MetaFunction = ({ params }) => {
  const pageParams = PATH_TO_PAGE_PARAMS.get(params["*"] ?? "");
  if (pageParams == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
  }

  const pageParamsTranslation = getPageParamsTranslation(pageParams, {
    isPlural: true,
  });

  return createSocialMeta({
    title: getPageTitle(`${pageParamsTranslation} à l’adoption`),
  });
};

function getPageParamsTranslation(
  pageParams: PageParams,
  { isPlural = false }: { isPlural?: boolean } = {},
) {
  if (pageParams.species == null) {
    return isPlural ? "Animaux" : "Animal";
  }

  const speciesMap = isPlural
    ? SPECIES_PLURAL_TRANSLATION
    : SPECIES_TRANSLATION;

  const ageMap = isPlural ? AGE_PLURAL_TRANSLATION : AGE_TRANSLATION;

  let translation = speciesMap[pageParams.species];

  if (pageParams.age != null) {
    translation = `${translation} ${ageMap[pageParams.age].toLowerCase()}`;
  }

  return translation;
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const params = useParams();
  const pageParams = PATH_TO_PAGE_PARAMS.get(params["*"] ?? "");
  invariant(pageParams != null, "pageParams should exists");

  const { totalCount, pageCount, animals } = useLoaderData<typeof loader>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header
        className={cn(
          "flex flex-col gap-6",
          "md:flex-row md:items-center md:gap-12",
        )}
      >
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:flex-1 md:text-title-hero-large md:text-left",
          )}
        >
          À adopter
        </h1>

        <div
          className={cn(
            "flex-none flex justify-center",
            "md:flex-1 md:max-w-sm",
          )}
        >
          <SearchForm
            hasAllSpeciesByDefault
            defaultSpecies={pageParams.species}
            defaultAge={pageParams.age}
            className={cn("w-full max-w-sm", "md:max-w-none")}
          />
        </div>
      </header>

      {totalCount > 0 ? (
        <>
          <h2 className={cn("text-gray-500 text-center", "md:text-left")}>
            {totalCount}{" "}
            {getPageParamsTranslation(pageParams, {
              isPlural: totalCount > 1,
            }).toLowerCase()}
          </h2>

          <section className="flex">
            <ul
              className={cn(
                "w-full grid grid-cols-1 gap-12 items-start",
                "xs:grid-cols-2",
                "sm:grid-cols-3",
              )}
            >
              {animals.map((animal) => (
                <AnimalItem key={animal.id} animal={animal} />
              ))}
            </ul>
          </section>
        </>
      ) : (
        <section
          className={cn(
            "py-12 flex flex-col gap-6 items-center text-center text-gray-500",
            "md:px-30 md:py-40",
          )}
        >
          <p className="w-full">
            Aucun {getPageParamsTranslation(pageParams).toLowerCase()} à
            l’adoption pour l’instant.
          </p>

          <BaseLink to="/adoption" className={actionClassNames.standalone()}>
            Voir toutes les espèces
          </BaseLink>
        </section>
      )}

      <Paginator pageCount={pageCount} className="self-center" />
    </main>
  );
}

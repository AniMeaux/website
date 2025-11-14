import { AnimalItem } from "#animals/item";
import { ADOPTABLE_ANIMAL_STATUS } from "#animals/status";
import { actionClassNames } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import {
  AGES_TO_PATH,
  ANIMAL_AGES_BY_SPECIES,
  SPECIES_TO_PATH,
  SearchForm,
} from "#core/controllers/searchForm";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { prisma } from "#core/db.server";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { getPage } from "#core/search-params";
import {
  AGE_PLURAL_TRANSLATION,
  AGE_TRANSLATION,
  SPECIES_PLURAL_TRANSLATION,
  SPECIES_TRANSLATION,
} from "#core/translations";
import type { AnimalAge } from "@animeaux/core";
import { ANIMAL_AGE_RANGE_BY_SPECIES, cn } from "@animeaux/core";
import type { Prisma, Species } from "@animeaux/prisma";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils/promise";
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

export async function loader({ params, request }: LoaderFunctionArgs) {
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

export const meta: MetaFunction = ({ params }) => {
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
    return isPlural ? "animaux" : "animal";
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
          À adopter
        </h1>

        <div
          className={cn(
            "flex flex-none justify-center",
            "md:max-w-sm md:flex-1",
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
          <h2 className={cn("text-center text-gray-500", "md:text-left")}>
            {totalCount}{" "}
            {getPageParamsTranslation(pageParams, {
              isPlural: totalCount > 1,
            })}
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
                <AnimalItem key={animal.id} animal={animal} />
              ))}
            </ul>
          </section>
        </>
      ) : (
        <section
          className={cn(
            "flex flex-col items-center gap-6 py-12 text-center text-gray-500",
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

import {
  AnimalAge,
  ANIMAL_AGE_RANGE_BY_SPECIES,
  formatAge,
} from "@animeaux/shared";
import { Gender, Prisma, Species, Status } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { DateTime } from "luxon";
import { ReactNode } from "react";
import invariant from "tiny-invariant";
import {
  AGES_TO_PATH,
  ANIMAL_AGES_BY_SPECIES,
  SearchForm,
  SPECIES_TO_PATH,
} from "~/controllers/searchForm";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { MapDateToString } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { isDefined } from "~/core/isDefined";
import { getPageTitle } from "~/core/pageTitle";
import { getPage, setPage } from "~/core/searchParams";
import {
  AGE_PLURAL_TRANSLATION,
  AGE_TRANSLATION,
  GENDER_TRANSLATION,
  SPECIES_PLURAL_TRANSLATION,
  SPECIES_TRANSLATION,
} from "~/core/translations";
import { DynamicImage } from "~/dataDisplay/image";
import { Icon } from "~/generated/icon";

const ADOPTABLE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
];

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
    }
  );

  return map;
}

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

  const [totalCount, animals] = await Promise.all([
    prisma.animal.count({ where }),
    prisma.animal.findMany({
      where,
      skip: page * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy: { name: "asc" },
      select: animalSelect.select,
    }),
  ]);

  const pageCount = Math.ceil(totalCount / ANIMAL_COUNT_PER_PAGE);

  return json<LoaderDataServer>({ totalCount, pageCount, animals });
};

function getAgeRangeSearchFilter(
  species?: Species,
  age?: AnimalAge
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

  // Don't change the title in case of 404.
  if (pageParams == null) {
    return {};
  }

  const pageParamsTranslation = getPageParamsTranslation(pageParams, {
    isPlural: true,
  });

  const title = getPageTitle(`${pageParamsTranslation} à l'adoption`);

  return {
    title,
    "og:title": title,
  };
};

function getPageParamsTranslation(
  pageParams: PageParams,
  { isPlural = false }: { isPlural?: boolean } = {}
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

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function AdoptionPage() {
  const params = useParams();
  const pageParams = PATH_TO_PAGE_PARAMS.get(params["*"] ?? "");
  invariant(pageParams != null, "pageParams should exists");

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
          À adopter
        </h1>

        <div
          className={cn(
            "flex-none px-2 flex justify-center",
            "md:px-0 md:flex-1 md:max-w-sm"
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
        <section className="flex flex-col gap-6">
          <h2 className={cn("text-gray-500 text-center", "md:text-left")}>
            {totalCount}{" "}
            {getPageParamsTranslation(pageParams, {
              isPlural: totalCount > 1,
            }).toLowerCase()}
          </h2>

          <ul
            className={cn(
              "grid grid-cols-1 grid-rows-[auto] gap-6",
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
        <p className={cn("px-4 py-12 text-center text-gray-500", "py-40")}>
          Aucun {getPageParamsTranslation(pageParams).toLowerCase()} à
          l'adoption pour l'instant
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
    <li className="flex">
      <BaseLink
        to={`/animal/${animal.id}`}
        className={cn(
          "group w-full px-4 py-3 shadow-none rounded-tl-[40px] rounded-tr-3xl rounded-br-[40px] rounded-bl-3xl bg-transparent flex flex-col gap-3 transition-[background-color,transform] duration-100 ease-in-out hover:bg-white hover:shadow-base",
          "md:p-6"
        )}
      >
        <DynamicImage
          imageId={animal.avatar}
          alt={animal.name}
          sizes={{ lg: "300px", md: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-tl-[16%] rounded-tr-[8%] rounded-br-[16%] rounded-bl-[8%]"
        />

        <div className="flex flex-col">
          <p className="flex items-start gap-1">
            <span
              className={cn("h-6 flex-none flex items-center text-[20px]", {
                "text-pink-base": animal.gender === Gender.FEMALE,
                "text-blue-base": animal.gender === Gender.MALE,
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
      </BaseLink>
    </li>
  );
}

function Paginator({
  pageCount,
  className,
}: {
  pageCount: number;
  className: string;
}) {
  const [searchParams] = useSearchParams();
  if (pageCount < 2) {
    return null;
  }

  const page = getPage(searchParams);

  const items: ReactNode[] = [];

  for (let index = 0; index < pageCount; index++) {
    items.push(
      <PaginatorItem
        key={index}
        isActive={page === index}
        to={{ search: setPage(new URLSearchParams(), index).toString() }}
      >
        {index + 1}
      </PaginatorItem>
    );
  }

  if (pageCount - page >= 4) {
    items.splice(
      page + 2,
      pageCount - page - 3,
      <PaginatorItem key={pageCount - 2} isEllipsis>
        ...
      </PaginatorItem>
    );
  }

  if (page >= 3) {
    items.splice(
      1,
      page - 2,
      <PaginatorItem key={1} isEllipsis>
        ...
      </PaginatorItem>
    );
  }

  return <ul className={cn(className, "flex gap-1 text-gray-500")}>{items}</ul>;
}

function PaginatorItem({
  isActive = false,
  isEllipsis = false,
  to,
  ...rest
}: Omit<BaseLinkProps, "disabled"> & {
  isActive?: boolean;
  isEllipsis?: boolean;
}) {
  return (
    <li className="flex-none flex">
      <BaseLink
        {...rest}
        to={to}
        disabled={isActive}
        className={cn(
          "h-[40px]",
          {
            "w-[40px] rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg":
              !isEllipsis,
          },
          "flex items-center justify-center text-body-emphasis transition-colors duration-100 ease-in-out",
          {
            "bg-blue-base text-white": isActive,
            "hover:bg-gray-200": !isActive && to != null,
          }
        )}
      />
    </li>
  );
}

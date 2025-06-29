import { AnimalAvatar } from "#animals/avatar";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { Avatar } from "#core/data-display/avatar";
import { Chip } from "#core/data-display/chip";
import { SimpleEmpty } from "#core/data-display/empty";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { FosterFamilyAvatar } from "#foster-families/avatar";
import { FosterFamilyFilters } from "#foster-families/filter-form";
import { FosterFamilySearchParams } from "#foster-families/search-params";
import { cn, getShortLocation } from "@animeaux/core";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { UserGroup } from "@prisma/client";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

const FOSTER_FAMILY_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const fosterFamilySearchParams = FosterFamilySearchParams.parse(searchParams);

  const { where, orderBy } = await db.fosterFamily.createFindManyParams(
    fosterFamilySearchParams,
  );

  const { possibleCities, totalCount, fosterFamilies } = await promiseHash({
    possibleCities: prisma.fosterFamily.groupBy({
      by: ["city"],
      _count: { city: true },
      orderBy: { city: "asc" },
    }),

    totalCount: prisma.fosterFamily.count({ where }),

    fosterFamilies: prisma.fosterFamily.findMany({
      skip: pageSearchParams.page * FOSTER_FAMILY_COUNT_PER_PAGE,
      take: FOSTER_FAMILY_COUNT_PER_PAGE,
      orderBy,
      where,
      select: {
        availability: true,
        city: true,
        displayName: true,
        fosterAnimals: { select: { avatar: true, name: true, id: true } },
        id: true,
        isBanned: true,
        zipCode: true,
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / FOSTER_FAMILY_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    fosterFamilies,
    possibleCities: possibleCities.map((group) => group.city),
  });
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Familles d’accueil") }];
};

export default function Route() {
  const { totalCount, pageCount, fosterFamilies, possibleCities } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        <section className="flex flex-col gap-1 md:flex-row md:gap-2">
          <section className="flex flex-col md:min-w-0 md:flex-2">
            <Card>
              <Card.Header>
                <Card.Title>
                  {totalCount}{" "}
                  {totalCount > 1 ? "familles d’accueil" : "famille d’accueil"}
                </Card.Title>

                <Action asChild variant="text">
                  <BaseLink to={Routes.fosterFamilies.new.toString()}>
                    Créer
                  </BaseLink>
                </Action>
              </Card.Header>

              <Card.Content hasListItems>
                {fosterFamilies.length > 0 ? (
                  <ul className="grid grid-cols-1">
                    {fosterFamilies.map((fosterFamily) => (
                      <li key={fosterFamily.id} className="flex">
                        <FosterFamilyItem
                          fosterFamily={fosterFamily}
                          className="w-full"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <SimpleEmpty
                    isCompact
                    icon="🏡"
                    iconAlt="Maison avec jardin"
                    title="Aucune famille d’accueil trouvée"
                    message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                    titleElementType="h3"
                    action={
                      !FosterFamilySearchParams.isEmpty(searchParams) ? (
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

          <aside className="hidden min-w-[250px] max-w-[300px] flex-1 flex-col md:flex">
            <Card className="sticky top-[calc(20px+var(--header-height))] max-h-[calc(100vh-40px-var(--header-height))]">
              <Card.Header>
                <Card.Title>Filtrer</Card.Title>
              </Card.Header>

              <Card.Content hasVerticalScroll>
                <FosterFamilyFilters possibleCities={possibleCities} />
              </Card.Content>
            </Card>
          </aside>
        </section>

        <SortAndFiltersFloatingAction totalCount={totalCount}>
          <FosterFamilyFilters possibleCities={possibleCities} />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

function FosterFamilyItem({
  fosterFamily,
  className,
}: {
  fosterFamily: SerializeFrom<typeof loader>["fosterFamilies"][number];
  className?: string;
}) {
  const fosterAnimalsAvatars = fosterFamily.fosterAnimals.map((animal) => (
    <AnimalAvatar
      key={animal.id}
      size="sm"
      animal={animal}
      className={ANIMAL_AVATAR_CLASS_NAME}
    />
  ));

  if (fosterAnimalsAvatars.length > MAX_ANIMAL_AVATAR_COUNT) {
    const restCount =
      fosterAnimalsAvatars.length - (MAX_ANIMAL_AVATAR_COUNT - 1);

    fosterAnimalsAvatars.splice(
      MAX_ANIMAL_AVATAR_COUNT - 1,
      restCount,
      <Avatar
        key="ellipsis"
        color="gray-light"
        size="sm"
        className={ANIMAL_AVATAR_CLASS_NAME}
      >
        <span className="text-caption-emphasis">+{restCount}</span>
      </Avatar>,
    );
  }

  return (
    <BaseLink
      to={Routes.fosterFamilies.id(fosterFamily.id).toString()}
      className={cn(
        className,
        "grid grid-flow-col grid-cols-[auto_minmax(0px,1fr)] items-start gap-1 rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:gap-2 md:px-1",
      )}
    >
      <FosterFamilyAvatar size="sm" availability={fosterFamily.availability} />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{fosterFamily.displayName}</span>
        <span className="text-gray-500">{getShortLocation(fosterFamily)}</span>
      </span>

      {fosterFamily.isBanned ? (
        <Chip
          variant="primary"
          color="orange"
          icon="icon-ban-solid"
          title="Bloqué"
        />
      ) : null}

      {fosterAnimalsAvatars.length > 0 ? (
        <span className="flex self-center">{fosterAnimalsAvatars}</span>
      ) : null}
    </BaseLink>
  );
}

const MAX_ANIMAL_AVATAR_COUNT = 5;

const ANIMAL_AVATAR_CLASS_NAME = cn(
  "-ml-0.5 flex-none ring-2 ring-inheritBg first:ml-0",
);

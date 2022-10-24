import { Prisma, UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { AnimalFilters } from "~/animals/filterForm";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import { actionClassName } from "~/core/action";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Paginator } from "~/core/controllers/paginator";
import {
  assertCurrentUserHasGroups,
  getCurrentUser,
} from "~/core/currentUser.server";
import { Empty } from "~/core/dataDisplay/empty";
import { prisma } from "~/core/db.server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/layout/card";
import { PageSearchParams } from "~/core/params";
import { Icon } from "~/generated/icon";

// Multiple of 6, 5, 4 and 3 to be nicely displayed.
const ANIMAL_COUNT_PER_PAGE = 60;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
  ]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = new PageSearchParams(searchParams);
  const animalSearchParams = new AnimalSearchParams(searchParams);

  const where: Prisma.AnimalWhereInput = {};
  const species = animalSearchParams.getSpecies();
  if (species.length > 0) {
    where.species = { in: species };
  }

  const statuses = animalSearchParams.getStatuses();
  if (statuses.length > 0) {
    where.status = { in: statuses };
  }

  const managersId = animalSearchParams.getManagersId();
  if (managersId.length > 0) {
    where.managerId = { in: managersId };
  }

  const minPickUpDate = animalSearchParams.getMinPickUpDate();
  const maxPickUpDate = animalSearchParams.getMaxPickUpDate();
  if (minPickUpDate != null || maxPickUpDate != null) {
    where.pickUpDate = {};

    if (minPickUpDate != null) {
      where.pickUpDate.gte = minPickUpDate;
    }

    if (maxPickUpDate != null) {
      where.pickUpDate.lte = maxPickUpDate;
    }
  }

  const [managers, totalCount, animals] = await Promise.all([
    prisma.user.findMany({
      where: {
        isDisabled: false,
        groups: { has: UserGroup.ANIMAL_MANAGER },
      },
      select: { id: true, displayName: true },
      orderBy: { displayName: "asc" },
    }),
    prisma.animal.count({ where }),
    prisma.animal.findMany({
      skip: pageSearchParams.getPage() * ANIMAL_COUNT_PER_PAGE,
      take: ANIMAL_COUNT_PER_PAGE,
      orderBy:
        animalSearchParams.getSort() === AnimalSearchParams.Sort.NAME
          ? { name: "asc" }
          : { pickUpDate: "desc" },
      where,
      select: {
        id: true,
        avatar: true,
        name: true,
        alias: true,
        gender: true,
        status: true,
        manager: { select: { displayName: true } },
      },
    }),
  ]);

  const pageCount = Math.ceil(totalCount / ANIMAL_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    animals,
    managers,
    currentUser,
  });
}

export default function AnimalsPage() {
  const { totalCount, pageCount, animals } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const animalSearchParams = new AnimalSearchParams(searchParams);

  return (
    <section className="w-full flex flex-col gap-1 md:gap-2">
      {/* Helpers */}

      <section className="flex flex-col gap-1 md:flex-row md:gap-2">
        <aside className="hidden flex-col min-w-[250px] max-w-[300px] flex-1 md:flex">
          <Card className="sticky top-8 max-h-[calc(100vh-100px)]">
            <CardHeader>
              <CardTitle>Trier et filtrer</CardTitle>
            </CardHeader>

            <CardContent hasVerticalScroll>
              <SortAndFilters />
            </CardContent>
          </Card>
        </aside>

        <main className="flex flex-col md:min-w-0 md:flex-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {totalCount} {totalCount > 1 ? "animaux" : "animal"}
              </CardTitle>

              <BaseLink
                to="/animals/new"
                className={actionClassName({ variant: "text" })}
              >
                Créer
              </BaseLink>
            </CardHeader>

            <CardContent>
              {animals.length > 0 ? (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 md:gap-2">
                  {animals.map((animal, index) => (
                    <li key={animal.id} className="flex">
                      <AnimalItem
                        animal={animal}
                        imageSizes={{ default: "300px" }}
                        imageLoading={index < 15 ? "eager" : "lazy"}
                        className="w-full"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  icon="🪹"
                  iconAlt="Nid vide"
                  title="Aucun animal trouvé"
                  message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                  titleElementType="h3"
                  action={
                    !animalSearchParams.isEmpty() ? (
                      <BaseLink
                        to={{ search: "" }}
                        className={actionClassName()}
                      >
                        Effacer les filtres
                      </BaseLink>
                    ) : null
                  }
                />
              )}
            </CardContent>

            {pageCount > 1 && (
              <CardFooter>
                <Paginator pageCount={pageCount} />
              </CardFooter>
            )}
          </Card>
        </main>
      </section>

      <SortAndFiltersFloatingAction totalCount={totalCount} />
    </section>
  );
}

function SortAndFiltersFloatingAction({
  totalCount,
}: {
  totalCount: SerializeFrom<typeof loader>["totalCount"];
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={cn(
          "fixed bottom-safe-6 right-safe-1 z-20 md:hidden",
          actionClassName({ variant: "floating" })
        )}
      >
        <Icon id="filter" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20"
          )}
        />

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col gap-1">
          <header className="sticky top-0 z-20 min-h-[50px] px-safe-1 pt-safe-0.5 pb-0.5 flex-none bg-white flex items-center gap-1">
            <Dialog.Title className="flex-1 text-title-section-large">
              Trier et filtrer
            </Dialog.Title>

            <Dialog.Close
              className={cn("flex-none", actionClassName({ variant: "text" }))}
            >
              Fermer
            </Dialog.Close>
          </header>

          <Card>
            <CardContent>
              <SortAndFilters />
            </CardContent>
          </Card>

          <footer className="sticky bottom-0 z-20 px-safe-1 pt-1 pb-safe-1 flex-none bg-white flex">
            <Dialog.Close className={cn(actionClassName(), "w-full")}>
              Voir les résultats ({totalCount})
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SortAndFilters() {
  const { currentUser, managers } = useLoaderData<typeof loader>();
  return <AnimalFilters currentUser={currentUser} managers={managers} />;
}

import { Prisma, UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { DateTime } from "luxon";
import { AnimalItem } from "~/animals/item";
import { AnimalSearchParams } from "~/animals/searchParams";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  StatusIcon,
  STATUS_TRANSLATION,
} from "~/animals/status";
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
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/core/layout/card";
import { Separator } from "~/core/layout/separator";
import { PageSearchParams } from "~/core/params";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { hasGroups } from "~/users/groups";

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
          <Card className="sticky top-8 h-[calc(100vh-100px)]">
            <CardHeader>
              <CardTitle>Trier et filtrer</CardTitle>
            </CardHeader>

            <CardContent hasVerticalScroll>
              <SortAndFilters />
            </CardContent>
          </Card>
        </aside>

        <main className="min-w-0 flex-2 flex flex-col">
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
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 auto-rows-auto md:gap-2">
                  {animals.map((animal, index) => (
                    <li key={animal.id}>
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
          "fixed bottom-6 right-1 z-20 md:hidden",
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
          <header className="sticky top-0 z-20 min-h-[50px] px-1 py-0.5 flex-none bg-white flex items-center gap-1">
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

            <CardFooter className="sticky bottom-0 z-20">
              <Dialog.Close className={cn(actionClassName(), "w-full")}>
                Voir les résultats ({totalCount})
              </Dialog.Close>
            </CardFooter>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SortAndFilters() {
  const { managers } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useVisibleSearchParams();
  const visibleFilters = {
    sort: searchParams.getSort(),
    species: searchParams.getSpecies(),
    statuses: searchParams.getStatuses(),
    managersId: searchParams.getManagersId(),
    minPickUpDate: searchParams.getMinPickUpDate(),
    maxPickUpDate: searchParams.getMaxPickUpDate(),
  };

  return (
    <Form
      method="get"
      onChange={(event) => submit(event.currentTarget)}
      className={formClassNames.root()}
    >
      <div className={formClassNames.fields.root()}>
        <BaseLink
          to={{ search: "" }}
          className={actionClassName({ variant: "secondary", color: "gray" })}
        >
          Tout effacer
        </BaseLink>

        <ActiveFilterLink />
      </div>

      <Separator />

      <div className={formClassNames.fields.root()}>
        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>Trier</span>

          <Suggestion>
            <SuggestionInput
              type="radio"
              name={AnimalSearchParams.Keys.SORT}
              value={AnimalSearchParams.Sort.PICK_UP}
              checked={visibleFilters.sort === AnimalSearchParams.Sort.PICK_UP}
              onChange={() => {}}
            />

            <SuggestionLabel icon={<Icon id="calendarDays" />}>
              Date de prise en charge
            </SuggestionLabel>
          </Suggestion>

          <Suggestion>
            <SuggestionInput
              type="radio"
              name={AnimalSearchParams.Keys.SORT}
              value={AnimalSearchParams.Sort.NAME}
              checked={visibleFilters.sort === AnimalSearchParams.Sort.NAME}
              onChange={() => {}}
            />

            <SuggestionLabel icon={<Icon id="arrowDownAZ" />}>
              Alphabétique
            </SuggestionLabel>
          </Suggestion>
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>Espèces</span>

          {SORTED_SPECIES.map((species) => (
            <Suggestion key={species}>
              <SuggestionInput
                type="checkbox"
                name={AnimalSearchParams.Keys.SPECIES}
                value={species}
                checked={visibleFilters.species.includes(species)}
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id={SPECIES_ICON[species]} />}>
                {SPECIES_TRANSLATION[species]}
              </SuggestionLabel>
            </Suggestion>
          ))}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>Status</span>

          {SORTED_STATUS.map((status) => (
            <Suggestion key={status}>
              <SuggestionInput
                type="checkbox"
                name={AnimalSearchParams.Keys.STATUS}
                value={status}
                checked={visibleFilters.statuses.includes(status)}
                onChange={() => {}}
              />

              <SuggestionLabel icon={<StatusIcon status={status} />}>
                {STATUS_TRANSLATION[status]}
              </SuggestionLabel>
            </Suggestion>
          ))}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Responsable
          </span>

          {managers.map((manager) => (
            <Suggestion key={manager.id}>
              <SuggestionInput
                type="checkbox"
                name={AnimalSearchParams.Keys.MANAGERS_ID}
                value={manager.id}
                checked={visibleFilters.managersId.includes(manager.id)}
                onChange={() => {}}
              />

              <SuggestionLabel icon={<UserAvatar user={manager} size="sm" />}>
                {manager.displayName}
              </SuggestionLabel>
            </Suggestion>
          ))}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Pris en charge après le
          </span>

          <Input
            type="date"
            name={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
            value={
              visibleFilters.minPickUpDate == null
                ? ""
                : DateTime.fromJSDate(visibleFilters.minPickUpDate).toISODate()
            }
            onChange={() => {}}
            leftAdornment={
              <Adornment>
                <Icon id="calendarDays" />
              </Adornment>
            }
            rightAdornment={
              visibleFilters.minPickUpDate != null && (
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(searchParams.deleteMinPickUpDate())
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
              )
            }
          />
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Pris en charge avant le
          </span>

          <Input
            type="date"
            name={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
            value={
              visibleFilters.maxPickUpDate == null
                ? ""
                : DateTime.fromJSDate(visibleFilters.maxPickUpDate).toISODate()
            }
            onChange={() => {}}
            leftAdornment={
              <Adornment>
                <Icon id="calendarDays" />
              </Adornment>
            }
            rightAdornment={
              visibleFilters.maxPickUpDate != null && (
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(searchParams.deleteMaxPickUpDate())
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
              )
            }
          />
        </div>
      </div>
    </Form>
  );
}

function ActiveFilterLink() {
  const { currentUser } = useLoaderData<typeof loader>();
  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  let toSearchParams = new AnimalSearchParams().setStatuses(
    ACTIVE_ANIMAL_STATUS
  );
  if (isCurrentUserManager) {
    toSearchParams = toSearchParams.setManagersId([currentUser.id]);
  }

  const [searchParams] = useVisibleSearchParams();
  const isActive = toSearchParams.areFiltersEqual(searchParams);

  return (
    <BaseLink
      to={{ search: toSearchParams.toString() }}
      className={actionClassName({
        variant: "secondary",
        color: isActive ? "blue" : "gray",
      })}
    >
      {isActive && <Icon id="check" />}
      {isCurrentUserManager ? "À votre charge" : "Animaux en charge"}
    </BaseLink>
  );
}

function useVisibleSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const transition = useTransition();
  let nextSearchParams: URLSearchParams | undefined;
  if (transition.location?.pathname === "/animals") {
    nextSearchParams = new URLSearchParams(transition.location.search);
  }

  return [
    new AnimalSearchParams(
      // Optimistic UI.
      nextSearchParams ?? searchParams
    ),
    setSearchParams,
  ] as const;
}

function Suggestion({ children }: { children?: React.ReactNode }) {
  return (
    <label className="group relative z-0 rounded-0.5 p-0.5 flex items-start gap-1 cursor-pointer focus-within:z-10">
      {children}
    </label>
  );
}

function SuggestionInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="peer appearance-none absolute -z-10 top-0 left-0 w-full h-full rounded-0.5 cursor-pointer group-hover:bg-gray-50 checked:bg-gray-100 group-hover:checked:bg-gray-100 focus-visible:outline-none focus-visible:ring-outset focus-visible:ring focus-visible:ring-blue-400"
    />
  );
}

function SuggestionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <span className="h-2 w-2 flex-none flex items-center justify-center text-gray-600">
        {icon}
      </span>

      <span className="flex-1 text-body-default peer-checked:text-body-emphasis">
        {children}
      </span>

      <span className="opacity-0 h-2 w-2 flex-none flex items-center justify-center text-green-600 peer-checked:opacity-100">
        <Icon id="check" />
      </span>
    </>
  );
}

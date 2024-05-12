import { SPECIES_ICON } from "#animals/species";
import { BreedFilterForm } from "#breeds/filter-form";
import { BreedSearchParams, BreedSort } from "#breeds/search-params";
import { Action } from "#core/actions";
import { algolia } from "#core/algolia/algolia.server";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { Empty } from "#core/data-display/empty";
import { db } from "#core/db.server";
import { NotFoundError, ReferencedError } from "#core/errors.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { Dialog } from "#core/popovers/dialog";
import { prisma } from "#core/prisma.server";
import { BadRequestResponse, NotFoundResponse } from "#core/response.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import {
  FormDataDelegate,
  useOptimisticSearchParams,
} from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

const BREED_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const breedSearchParams = BreedSearchParams.parse(searchParams);

  const where: Prisma.BreedWhereInput[] = [];

  if (breedSearchParams.species.size > 0) {
    where.push({ species: { in: Array.from(breedSearchParams.species) } });
  }

  if (breedSearchParams.name != null) {
    const breeds = await algolia.breed.findMany({
      where: {
        name: breedSearchParams.name,
        species: breedSearchParams.species,
      },
    });

    where.push({ id: { in: breeds.map((breed) => breed.id) } });
  }

  const { breeds, totalCount } = await promiseHash({
    totalCount: prisma.breed.count({ where: { AND: where } }),

    breeds: prisma.breed.findMany({
      skip: pageSearchParams.page * BREED_COUNT_PER_PAGE,
      take: BREED_COUNT_PER_PAGE,
      orderBy: BREED_ORDER_BY[breedSearchParams.sort],
      where: { AND: where },
      select: {
        id: true,
        name: true,
        species: true,
        _count: {
          select: {
            animals: true,
          },
        },
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / BREED_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, breeds });
}

const BREED_ORDER_BY: Record<BreedSort, Prisma.BreedFindManyArgs["orderBy"]> = {
  [BreedSort.NAME]: { name: "asc" },
  [BreedSort.ANIMAL_COUNT]: { animals: { _count: "desc" } },
};

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Races") }];
};

const DeleteActionFormData = FormDataDelegate.create(
  zu.object({
    id: zu.string().uuid(),
  }),
);

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw new NotFoundResponse();
  }

  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const formData = DeleteActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    throw new BadRequestResponse();
  }

  try {
    await db.breed.delete(formData.data.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundResponse();
    }

    if (error instanceof ReferencedError) {
      throw new BadRequestResponse();
    }

    throw error;
  }

  return new Response("OK");
}

export default function Route() {
  const { totalCount, pageCount, breeds } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="flex flex-col md:min-w-0 md:flex-2">
          <Card>
            <Card.Header>
              <Card.Title>
                {totalCount} {totalCount > 1 ? "races" : "race"}
              </Card.Title>

              <Action asChild variant="text">
                <BaseLink to={Routes.breeds.new.toString()}>Créer</BaseLink>
              </Action>
            </Card.Header>

            <Card.Content hasListItems>
              {breeds.length > 0 ? (
                <ul className="grid grid-cols-1">
                  {breeds.map((breed) => (
                    <li key={breed.id} className="flex">
                      <BreedItem breed={breed} className="w-full" />
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  isCompact
                  icon="🧬"
                  iconAlt="ADN"
                  title="Aucune race trouvée"
                  message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                  titleElementType="h3"
                  action={
                    !BreedSearchParams.isEmpty(searchParams) ? (
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
          <Card className="sticky top-8 max-h-[calc(100vh-100px)]">
            <Card.Header>
              <Card.Title>Trier et filtrer</Card.Title>
            </Card.Header>

            <Card.Content hasVerticalScroll>
              <BreedFilterForm />
            </Card.Content>
          </Card>
        </aside>

        <SortAndFiltersFloatingAction hasSort totalCount={totalCount}>
          <BreedFilterForm />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout>
  );
}

export function BreedItem({
  breed,
  className,
}: {
  breed: SerializeFrom<typeof loader>["breeds"][number];
  className?: string;
}) {
  const fetcher = useFetcher<typeof action>();

  return (
    <span
      className={cn(
        "grid grid-flow-col grid-cols-[auto_minmax(0px,1fr)] items-start gap-1 px-0.5 py-1 md:gap-2 md:px-1",
        className,
      )}
    >
      <Icon
        href={SPECIES_ICON[breed.species]}
        className="text-[20px] text-gray-600"
      />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{breed.name}</span>

        <span className="text-gray-500">
          {breed._count.animals}{" "}
          {breed._count.animals > 1 ? "animaux" : "animal"}
        </span>
      </span>

      <span className="flex h-2 items-center gap-0.5">
        <Action asChild variant="text" color="gray" isIconOnly title="Modifier">
          <BaseLink to={Routes.breeds.id(breed.id).edit.toString()}>
            <Action.Icon href="icon-pen" />
          </BaseLink>
        </Action>

        <Dialog>
          <Dialog.Trigger asChild>
            <Action
              variant="text"
              color="red"
              isIconOnly
              title={
                breed._count.animals > 0
                  ? "La race ne peut être supprimée tant que des animaux sont de cette race."
                  : "Supprimer"
              }
              disabled={breed._count.animals > 0}
            >
              <Action.Icon href="icon-trash" />
            </Action>
          </Dialog.Trigger>

          <Dialog.Content variant="alert">
            <Dialog.Header>Supprimer {breed.name}</Dialog.Header>

            <Dialog.Message>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong className="text-body-emphasis">{breed.name}</strong>
              {" "}?
              <br />
              L’action est irréversible.
            </Dialog.Message>

            <Dialog.Actions>
              <Dialog.CloseAction>Annuler</Dialog.CloseAction>

              <fetcher.Form method="DELETE" className="flex">
                <Dialog.ConfirmAction
                  type="submit"
                  name={DeleteActionFormData.keys.id}
                  value={breed.id}
                >
                  Oui, supprimer
                </Dialog.ConfirmAction>
              </fetcher.Form>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </span>
    </span>
  );
}

import { Prisma, UserGroup } from "@prisma/client";
import { ActionArgs, LoaderArgs, SerializeFrom, json } from "@remix-run/node";
import { V2_MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { SPECIES_ICON } from "~/animals/species";
import { BreedFilterForm } from "~/breeds/filterForm";
import { BreedSearchParams } from "~/breeds/searchParams";
import { createActionData } from "~/core/actionData";
import { Action } from "~/core/actions";
import { algolia } from "~/core/algolia/algolia.server";
import { BaseLink } from "~/core/baseLink";
import { Paginator } from "~/core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "~/core/controllers/sortAndFiltersFloatingAction";
import { Empty } from "~/core/dataDisplay/empty";
import { db } from "~/core/db.server";
import { NotFoundError, ReferencedError } from "~/core/errors.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { Dialog } from "~/core/popovers/dialog";
import { prisma } from "~/core/prisma.server";
import { BadRequestResponse, NotFoundResponse } from "~/core/response.server";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "~/core/searchParams";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";

const BREED_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = new PageSearchParams(searchParams);
  const breedSearchParams = new BreedSearchParams(searchParams);

  const where: Prisma.BreedWhereInput[] = [];

  const species = breedSearchParams.getSpecies();
  if (species.length > 0) {
    where.push({ species: { in: species } });
  }

  const name = breedSearchParams.getName();
  if (name != null) {
    const breeds = await algolia.breed.search({ name, species });
    where.push({ id: { in: breeds.map((breed) => breed.id) } });
  }

  const sort = breedSearchParams.getSort();

  const { breeds, totalCount } = await promiseHash({
    totalCount: prisma.breed.count({ where: { AND: where } }),

    breeds: prisma.breed.findMany({
      skip: pageSearchParams.getPage() * BREED_COUNT_PER_PAGE,
      take: BREED_COUNT_PER_PAGE,
      orderBy: BREED_ORDER_BY[sort],
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

const BREED_ORDER_BY: Record<
  (typeof BreedSearchParams.Sort)[keyof typeof BreedSearchParams.Sort],
  Prisma.BreedFindManyArgs["orderBy"]
> = {
  [BreedSearchParams.Sort.NAME]: { name: "asc" },
  [BreedSearchParams.Sort.ANIMAL_COUNT]: { animals: { _count: "desc" } },
};

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Races") }];
};

const DeleteActionFormData = createActionData(
  z.object({
    id: z.string().uuid(),
  })
);

export async function action({ request }: ActionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw new NotFoundResponse();
  }

  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const rawFormData = await request.formData();
  const formData = zfd
    .formData(DeleteActionFormData.schema)
    .safeParse(rawFormData);
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
  const breedSearchParams = new BreedSearchParams(searchParams);

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="md:min-w-0 md:flex-2 flex flex-col">
          <Card>
            <Card.Header>
              <Card.Title>
                {totalCount} {totalCount > 1 ? "races" : "race"}
              </Card.Title>

              <Action asChild variant="text">
                <BaseLink to="./new">Créer</BaseLink>
              </Action>
            </Card.Header>

            <Card.Content>
              {breeds.length > 0 ? (
                <ul className="grid grid-cols-1">
                  {breeds.map((breed) => (
                    <li key={breed.id} className="flex">
                      <BreedItem breed={breed} />
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
                    !breedSearchParams.isEmpty() ? (
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

        <aside className="hidden flex-col min-w-[250px] max-w-[300px] flex-1 md:flex">
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
}: {
  breed: SerializeFrom<typeof loader>["breeds"][number];
}) {
  const fetcher = useFetcher<typeof action>();

  return (
    <span className="w-full py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2">
      <Icon
        id={SPECIES_ICON[breed.species]}
        className="text-[20px] text-gray-600"
      />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{breed.name}</span>

        <span className="text-gray-500">
          {breed._count.animals}{" "}
          {breed._count.animals > 1 ? "animaux" : "animal"}
        </span>
      </span>

      <span className="h-2 flex items-center gap-0.5">
        <Action asChild variant="text" color="gray" isIconOnly title="Modifier">
          <BaseLink to={`./${breed.id}/edit`}>
            <Icon id="pen" />
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
              <Icon id="trash" />
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

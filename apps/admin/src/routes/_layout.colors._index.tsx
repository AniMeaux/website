import { ColorFilterForm } from "#colors/filterForm.tsx";
import { ColorSearchParams, ColorSort } from "#colors/searchParams.ts";
import { createActionData } from "#core/actionData.tsx";
import { Action } from "#core/actions.tsx";
import { algolia } from "#core/algolia/algolia.server.ts";
import { BaseLink } from "#core/baseLink.tsx";
import { Paginator } from "#core/controllers/paginator.tsx";
import { SortAndFiltersFloatingAction } from "#core/controllers/sortAndFiltersFloatingAction.tsx";
import { Empty } from "#core/dataDisplay/empty.tsx";
import { db } from "#core/db.server.ts";
import { NotFoundError, ReferencedError } from "#core/errors.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { Dialog } from "#core/popovers/dialog.tsx";
import { prisma } from "#core/prisma.server.ts";
import { BadRequestResponse, NotFoundResponse } from "#core/response.server.ts";
import {
  PageSearchParams,
  useOptimisticSearchParams,
} from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { Icon } from "#generated/icon.tsx";
import type { Prisma } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { ActionArgs, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils";
import { z } from "zod";
import { zfd } from "zod-form-data";

const COLOR_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const colorSearchParams = ColorSearchParams.parse(searchParams);

  const where: Prisma.ColorWhereInput[] = [];

  if (colorSearchParams.name != null) {
    const colors = await algolia.color.search({
      name: colorSearchParams.name,
    });
    where.push({ id: { in: colors.map((color) => color.id) } });
  }

  const { colors, totalCount } = await promiseHash({
    totalCount: prisma.color.count({ where: { AND: where } }),

    colors: prisma.color.findMany({
      skip: pageSearchParams.page * COLOR_COUNT_PER_PAGE,
      take: COLOR_COUNT_PER_PAGE,
      orderBy: COLOR_ORDER_BY[colorSearchParams.sort],
      where: { AND: where },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            animals: true,
          },
        },
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / COLOR_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, colors });
}

const COLOR_ORDER_BY: Record<ColorSort, Prisma.ColorFindManyArgs["orderBy"]> = {
  [ColorSort.NAME]: { name: "asc" },
  [ColorSort.ANIMAL_COUNT]: { animals: { _count: "desc" } },
};

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Couleurs") }];
};

const DeleteActionFormData = createActionData(
  z.object({
    id: z.string().uuid(),
  }),
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
    await db.color.delete(formData.data.id);
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
  const { totalCount, pageCount, colors } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="md:min-w-0 md:flex-2 flex flex-col">
          <Card>
            <Card.Header>
              <Card.Title>
                {totalCount} {totalCount > 1 ? "couleurs" : "couleur"}
              </Card.Title>

              <Action asChild variant="text">
                <BaseLink to={Routes.colors.new.toString()}>Créer</BaseLink>
              </Action>
            </Card.Header>

            <Card.Content>
              {colors.length > 0 ? (
                <ul className="grid grid-cols-1">
                  {colors.map((color) => (
                    <li key={color.id} className="flex">
                      <ColorItem color={color} />
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  isCompact
                  icon="🎨"
                  iconAlt="Palette d’artiste"
                  title="Aucune couleur trouvée"
                  message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
                  titleElementType="h3"
                  action={
                    !ColorSearchParams.isEmpty(searchParams) ? (
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
              <ColorFilterForm />
            </Card.Content>
          </Card>
        </aside>

        <SortAndFiltersFloatingAction hasSort totalCount={totalCount}>
          <ColorFilterForm />
        </SortAndFiltersFloatingAction>
      </PageLayout.Content>
    </PageLayout>
  );
}

export function ColorItem({
  color,
}: {
  color: SerializeFrom<typeof loader>["colors"][number];
}) {
  const fetcher = useFetcher<typeof action>();

  return (
    <span className="w-full py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2">
      <Icon id="palette" className="text-[20px] text-gray-600" />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{color.name}</span>

        <span className="text-gray-500">
          {color._count.animals}{" "}
          {color._count.animals > 1 ? "animaux" : "animal"}
        </span>
      </span>

      <span className="h-2 flex items-center gap-0.5">
        <Action asChild variant="text" color="gray" isIconOnly title="Modifier">
          <BaseLink to={Routes.colors.id(color.id).edit.toString()}>
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
                color._count.animals > 0
                  ? "La couleur ne peut être supprimée tant que des animaux sont de cette couleur."
                  : "Supprimer"
              }
              disabled={color._count.animals > 0}
            >
              <Icon id="trash" />
            </Action>
          </Dialog.Trigger>

          <Dialog.Content variant="alert">
            <Dialog.Header>Supprimer {color.name}</Dialog.Header>

            <Dialog.Message>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong className="text-body-emphasis">{color.name}</strong>
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
                  value={color.id}
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

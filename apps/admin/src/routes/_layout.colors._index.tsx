import { ColorFilterForm } from "#colors/filter-form";
import { ColorSearchParams } from "#colors/search-params";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { SimpleEmpty } from "#core/data-display/empty";
import { db } from "#core/db.server";
import { NotFoundError, ReferencedError } from "#core/errors.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { Dialog } from "#core/popovers/dialog";
import { prisma } from "#core/prisma.server";
import { badRequest, notFound } from "#core/response.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { FormDataDelegate } from "@animeaux/form-data";
import { UserGroup } from "@animeaux/prisma";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

const COLOR_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);
  const colorSearchParams = ColorSearchParams.parse(searchParams);

  const { where, orderBy } =
    await db.color.createFindManyParams(colorSearchParams);

  const { colors, totalCount } = await promiseHash({
    totalCount: prisma.color.count({ where }),

    colors: prisma.color.findMany({
      skip: pageSearchParams.page * COLOR_COUNT_PER_PAGE,
      take: COLOR_COUNT_PER_PAGE,
      orderBy,
      where,
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

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Couleurs") }];
};

const DeleteActionFormData = FormDataDelegate.create(
  zu.object({
    id: zu.string().uuid(),
  }),
);

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "DELETE") {
    throw notFound();
  }

  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const formData = DeleteActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    throw badRequest();
  }

  try {
    await db.color.delete(formData.data.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    if (error instanceof ReferencedError) {
      throw badRequest();
    }

    throw error;
  }

  return new Response("OK");
}

export default function Route() {
  const { totalCount, pageCount, colors } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="flex flex-col md:min-w-0 md:flex-2">
          <Card>
            <Card.Header>
              <Card.Title>
                {totalCount} {totalCount > 1 ? "couleurs" : "couleur"}
              </Card.Title>

              <Action asChild variant="text">
                <BaseLink to={Routes.colors.new.toString()}>Créer</BaseLink>
              </Action>
            </Card.Header>

            <Card.Content hasListItems>
              {colors.length > 0 ? (
                <ul className="grid grid-cols-1">
                  {colors.map((color) => (
                    <li key={color.id} className="flex">
                      <ColorItem color={color} className="w-full" />
                    </li>
                  ))}
                </ul>
              ) : (
                <SimpleEmpty
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

        <aside className="hidden min-w-[250px] max-w-[300px] flex-1 flex-col md:flex">
          <Card className="sticky top-[calc(20px+var(--header-height))] max-h-[calc(100vh-40px-var(--header-height))]">
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
    </PageLayout.Root>
  );
}

export function ColorItem({
  color,
  className,
}: {
  color: SerializeFrom<typeof loader>["colors"][number];
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
      <Icon href="icon-palette-solid" className="text-[20px] text-gray-600" />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{color.name}</span>

        <span className="text-gray-500">
          {color._count.animals}{" "}
          {color._count.animals > 1 ? "animaux" : "animal"}
        </span>
      </span>

      <span className="flex h-2 items-center gap-0.5">
        <Action asChild variant="text" color="gray" isIconOnly title="Modifier">
          <BaseLink to={Routes.colors.id(color.id).edit.toString()}>
            <Action.Icon href="icon-pen-solid" />
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
              <Action.Icon href="icon-trash-solid" />
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

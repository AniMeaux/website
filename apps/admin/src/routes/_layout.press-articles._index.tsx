import { UserGroup } from "@prisma/client";
import { ActionArgs, LoaderArgs, SerializeFrom, json } from "@remix-run/node";
import { V2_MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { promiseHash } from "remix-utils";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { createActionData } from "~/core/actionData";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Paginator } from "~/core/controllers/paginator";
import { Empty } from "~/core/dataDisplay/empty";
import { DynamicImage } from "~/core/dataDisplay/image";
import {
  InstanceColor,
  inferInstanceColor,
} from "~/core/dataDisplay/instanceColor";
import { db } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { Dialog } from "~/core/popovers/dialog";
import { prisma } from "~/core/prisma.server";
import { BadRequestResponse, NotFoundResponse } from "~/core/response.server";
import { PageSearchParams } from "~/core/searchParams";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";

const PRESS_ARTICLES_COUNT_PER_PAGE = 20;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);

  const { pressArticles, totalCount } = await promiseHash({
    totalCount: prisma.pressArticle.count(),

    pressArticles: prisma.pressArticle.findMany({
      skip: pageSearchParams.page * PRESS_ARTICLES_COUNT_PER_PAGE,
      take: PRESS_ARTICLES_COUNT_PER_PAGE,
      orderBy: { publicationDate: "desc" },
      select: {
        id: true,
        image: true,
        publicationDate: true,
        publisherName: true,
        title: true,
        url: true,
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / PRESS_ARTICLES_COUNT_PER_PAGE);

  return json({ totalCount, pageCount, pressArticles });
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Articles de presse") }];
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
    await db.pressArticle.delete(formData.data.id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundResponse();
    }

    throw error;
  }

  return new Response("OK");
}

export default function Route() {
  const { totalCount, pageCount, pressArticles } =
    useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col">
        <Card>
          <Card.Header>
            <Card.Title>
              {totalCount}{" "}
              {totalCount > 1 ? "articles de presse" : "article de presse"}
            </Card.Title>

            <Action asChild variant="text">
              <BaseLink to="./add">Ajouter</BaseLink>
            </Action>
          </Card.Header>

          <Card.Content>
            {pressArticles.length > 0 ? (
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 md:gap-2">
                {pressArticles.map((pressArticle, index) => (
                  <li key={pressArticle.id} className="flex flex-col">
                    <PressArticleItem
                      pressArticle={pressArticle}
                      imageLoading={index < 15 ? "eager" : "lazy"}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <Empty
                isCompact
                icon="📰"
                iconAlt="Journal"
                title="Aucun article de presse"
                message="Pour l’instant ;)"
                titleElementType="h3"
              />
            )}
          </Card.Content>

          {pageCount > 1 ? (
            <Card.Footer>
              <Paginator pageCount={pageCount} />
            </Card.Footer>
          ) : null}
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}

function PressArticleItem({
  pressArticle,
  imageLoading,
}: {
  pressArticle: SerializeFrom<typeof loader>["pressArticles"][number];
  imageLoading: NonNullable<
    React.ComponentPropsWithoutRef<typeof DynamicImage>["loading"]
  >;
}) {
  const fetcher = useFetcher<typeof action>();

  return (
    <BaseLink
      shouldOpenInNewTarget
      to={pressArticle.url}
      className="group rounded-1 flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <span className="relative flex flex-col">
        {pressArticle.image === null ? (
          <DynamicImage
            loading={imageLoading}
            imageId="press-articles/fallback"
            alt={pressArticle.title}
            fallbackSize="512"
            sizes={{ default: "300px" }}
            className="w-full flex-none rounded-1"
          />
        ) : (
          <img
            loading={imageLoading}
            src={pressArticle.image}
            alt={pressArticle.title}
            className="w-full aspect-4/3 flex-none rounded-1 bg-gray-100 object-cover"
          />
        )}

        <Dialog>
          <span
            onClick={(event) => event.preventDefault()}
            className="absolute bottom-0.5 right-0.5 flex"
          >
            <Dialog.Trigger asChild>
              <Action
                isIconOnly
                type="button"
                variant="translucid"
                color="black"
              >
                <Icon id="trash" />
              </Action>
            </Dialog.Trigger>
          </span>

          <Dialog.Content variant="alert">
            <Dialog.Header>Retirer l’article de presse</Dialog.Header>

            <Dialog.Message>
              Êtes-vous sûr de vouloir retirer{" "}
              <strong className="text-body-emphasis">
                {pressArticle.title}
              </strong>
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
                  value={pressArticle.id}
                >
                  Oui, retirer
                </Dialog.ConfirmAction>
              </fetcher.Form>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </span>

      <div className="flex flex-col">
        <p className="text-caption-default text-gray-500">
          {DateTime.fromISO(pressArticle.publicationDate).toLocaleString(
            DateTime.DATE_MED
          )}
          {" • "}
          {pressArticle.publisherName}
        </p>

        <p
          className={cn(
            "text-body-default transition-colors duration-100 ease-in-out",
            TITLE_CLASS_NAME[inferInstanceColor(pressArticle.id)]
          )}
        >
          {pressArticle.title}
        </p>
      </div>
    </BaseLink>
  );
}

const TITLE_CLASS_NAME: Record<InstanceColor, string> = {
  blue: "group-hover:text-blue-600",
  green: "group-hover:text-green-700",
  red: "group-hover:text-red-600",
  yellow: "group-hover:text-yellow-600",
};

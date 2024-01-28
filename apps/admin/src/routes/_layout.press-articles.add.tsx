import { ErrorPage } from "#core/dataDisplay/errorPage";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes, useBackIfPossible } from "#core/navigation";
import { getPageTitle } from "#core/pageTitle";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server";
import {
  InvalidPublicationDateError,
  UrlAlreadyUsedError,
} from "#pressArticles/db.server";
import { ActionFormData, PressArticleForm } from "#pressArticles/form";
import type { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Nouvel article de presse") }];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await db.pressArticle.create({
      image: formData.data.image || null,
      publicationDate: formData.data.publicationDate,
      publisherName: formData.data.publisherName,
      title: formData.data.title,
      url: formData.data.url,
    });
  } catch (error) {
    if (error instanceof UrlAlreadyUsedError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: { url: ["Cet article de press a déjà été ajouté"] },
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof InvalidPublicationDateError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              publicationDate: [
                "La date de publication doit être antérieure à aujourd’hui.",
              ],
            },
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({ redirectTo: Routes.pressArticles.toString() });
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Nouvel article de presse</Card.Title>
          </Card.Header>

          <Card.Content>
            <PressArticleForm fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}

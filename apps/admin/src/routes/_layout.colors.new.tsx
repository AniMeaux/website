import { ActionFormData, ColorForm } from "#i/colors/form";
import { ErrorPage } from "#i/core/data-display/error-page";
import { db } from "#i/core/db.server";
import { AlreadyExistError } from "#i/core/errors.server";
import { Card } from "#i/core/layout/card";
import { PageLayout } from "#i/core/layout/page";
import { Routes, useBackIfPossible } from "#i/core/navigation";
import { getPageTitle } from "#i/core/page-title";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { UserGroup } from "@animeaux/prisma";
import type { zu } from "@animeaux/zod-utils";
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
  return [{ title: getPageTitle("Nouvelle couleur") }];
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
    await db.color.create({ name: formData.data.name });
  } catch (error) {
    if (error instanceof AlreadyExistError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["Cette couleur existe déjà."],
            fieldErrors: {},
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({ redirectTo: Routes.colors.toString() });
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Nouvelle couleur</Card.Title>
          </Card.Header>

          <Card.Content>
            <ColorForm fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

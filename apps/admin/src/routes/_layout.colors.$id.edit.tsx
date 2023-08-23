import { ActionFormData, ColorForm } from "#colors/form.tsx";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { db } from "#core/db.server.ts";
import { AlreadyExistError } from "#core/errors.server.ts";
import { assertIsDefined } from "#core/isDefined.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes, useBackIfPossible } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { UserGroup } from "@prisma/client";
import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { V2_MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const color = await prisma.color.findUnique({
    where: { id: result.data },
    select: { name: true },
  });

  assertIsDefined(color);

  return json({ color });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  if (data?.color == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Modifier ${data.color.name}`) }];
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const idResult = z.string().uuid().safeParse(params["id"]);
  if (!idResult.success) {
    throw new NotFoundResponse();
  }

  const rawFormData = await request.formData();
  const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await db.color.update(idResult.data, {
      name: formData.data.name,
    });
  } catch (error) {
    if (error instanceof AlreadyExistError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["Cette couleur existe déjà."],
            fieldErrors: {},
          },
        },
        { status: 400 }
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
  const { color } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Modifier {color.name}</Card.Title>
          </Card.Header>

          <Card.Content>
            <ColorForm defaultColor={color} fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}

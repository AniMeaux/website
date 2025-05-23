import { ActionFormData, BreedForm } from "#breeds/form";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { AlreadyExistError } from "#core/errors.server";
import { assertIsDefined } from "#core/is-defined.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes, useBackIfPossible } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const breed = await prisma.breed.findUnique({
    where: { id: paramsResult.data.id },
    select: {
      name: true,
      species: true,
    },
  });

  assertIsDefined(breed);

  return json({ breed });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data?.breed == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Modifier ${data.breed.name}`) }];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await db.breed.update(paramsResult.data.id, {
      name: formData.data.name,
      species: formData.data.species,
    });
  } catch (error) {
    if (error instanceof AlreadyExistError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["Cette race existe déjà."],
            fieldErrors: {},
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({ redirectTo: Routes.breeds.toString() });
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { breed } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Modifier {breed.name}</Card.Title>
          </Card.Header>

          <Card.Content>
            <BreedForm defaultBreed={breed} fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

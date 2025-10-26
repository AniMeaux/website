import { AnimalCreationSteps } from "#animals/creation-steps";
import { BreedNotForSpeciesError } from "#animals/profile/db.server";
import { ActionFormData, AnimalProfileForm } from "#animals/profile/form";
import { ErrorPage } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserGroup } from "@animeaux/prisma/client";
import type { zu } from "@animeaux/zod-utils";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: {
      groups: true,
      draft: {
        include: {
          breed: { select: { id: true, name: true } },
          color: { select: { id: true, name: true } },
        },
      },
    },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return json({ draft: currentUser.draft });
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle(["Nouvel animal", "Profil"]) }];
};

type ActionData = {
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await db.animal.profile.updateDraft(currentUser.id, {
      species: formData.data.species,
      name: formData.data.name,
      alias: formData.data.alias || null,
      birthdate: formData.data.birthdate,
      breedId: formData.data.breedId || null,
      colorId: formData.data.colorId || null,
      description: formData.data.description || null,
      gender: formData.data.gender,
      iCadNumber: formData.data.iCadNumber || null,
      isOkCats: formData.data.isOkCats,
      isOkChildren: formData.data.isOkChildren,
      isOkDogs: formData.data.isOkDogs,
    });
  } catch (error) {
    if (error instanceof BreedNotForSpeciesError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              breedId: ["La race n’appartient pas à cette espèce"],
            },
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }

  throw redirect(Routes.animals.new.situation.toString());
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { draft } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header isVertical>
            <Card.Title>Nouvel animal</Card.Title>
            <AnimalCreationSteps activeStep="profile" />
          </Card.Header>

          <Card.Content>
            <AnimalProfileForm
              isCreate
              defaultAnimal={draft}
              fetcher={fetcher}
            />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

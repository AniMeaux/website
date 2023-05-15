import { UserGroup } from "@prisma/client";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, V2_MetaFunction } from "@remix-run/react";
import { z } from "zod";
import { AnimalCreationSteps } from "~/animals/creationSteps";
import {
  BreedNotForSpeciesError,
  updateAnimalProfileDraft,
} from "~/animals/profile/db.server";
import { ActionFormData, AnimalProfileForm } from "~/animals/profile/form";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
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

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle(["Nouvel animal", "Profil"]) }];
};

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const rawFormData = await request.formData();
  const formData = ActionFormData.schema.safeParse(
    Object.fromEntries(rawFormData.entries())
  );

  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await updateAnimalProfileDraft(currentUser.id, {
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
        { status: 400 }
      );
    }

    throw error;
  }

  throw redirect("/animals/new/situation");
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { draft } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <PageLayout.Content className="flex flex-col items-center">
      <Card className="w-full md:max-w-[600px]">
        <Card.Header isVertical>
          <Card.Title>Nouvel animal</Card.Title>
          <AnimalCreationSteps activeStep="profile" />
        </Card.Header>

        <Card.Content>
          <AnimalProfileForm isCreate defaultAnimal={draft} fetcher={fetcher} />
        </Card.Content>
      </Card>
    </PageLayout.Content>
  );
}

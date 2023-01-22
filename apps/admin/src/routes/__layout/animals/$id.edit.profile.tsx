import { UserGroup } from "@prisma/client";
import { ActionArgs, json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import {
  BreedNotForSpeciesError,
  updateAnimalProfile,
} from "~/animals/profile/db.server";
import { ActionFormData, AnimalProfileForm } from "~/animals/profile/form";
import { getAnimalDisplayName } from "~/animals/profile/name";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { PageContent } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const animal = await prisma.animal.findUnique({
    where: { id: result.data },
    select: {
      alias: true,
      birthdate: true,
      breed: { select: { id: true, name: true } },
      color: { select: { id: true, name: true } },
      description: true,
      gender: true,
      iCadNumber: true,
      isOkCats: true,
      isOkChildren: true,
      isOkDogs: true,
      name: true,
      species: true,
      status: true,
    },
  });

  assertIsDefined(animal);

  return json({ animal });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal;
  if (animal == null) {
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return {
    title: getPageTitle([`Modifier ${getAnimalDisplayName(animal)}`, "Profil"]),
  };
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const idResult = z.string().uuid().safeParse(params["id"]);
  if (!idResult.success) {
    throw new NotFoundResponse();
  }

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
    await updateAnimalProfile(idResult.data, {
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
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["L’animal est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 }
      );
    }

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

  return json<ActionData>({ redirectTo: `/animals/${idResult.data}` });
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function AnimalEditProfilePage() {
  const { animal } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageContent className="flex flex-col items-center">
      <Card className="w-full md:max-w-[600px]">
        <CardHeader>
          <CardTitle>Modifier {animal.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <AnimalProfileForm defaultAnimal={animal} fetcher={fetcher} />
        </CardContent>
      </Card>
    </PageContent>
  );
}

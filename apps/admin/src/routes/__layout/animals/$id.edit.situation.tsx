import { UserGroup } from "@prisma/client";
import { ActionArgs, json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { getAnimalDisplayName } from "~/animals/profile/name";
import {
  MissingAdoptionDateError,
  MissingManagerError,
  MissingNextVaccinationError,
  MissingPickUpLocationError,
  NotManagerError,
  updateAnimalSituation,
} from "~/animals/situation/db.server";
import { ActionFormData, AnimalSituationForm } from "~/animals/situation/form";
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
      adoptionDate: true,
      adoptionOption: true,
      alias: true,
      comments: true,
      fosterFamily: { select: { id: true, displayName: true } },
      isSterilizationMandatory: true,
      isSterilized: true,
      manager: { select: { id: true, displayName: true } },
      name: true,
      nextVaccinationDate: true,
      pickUpDate: true,
      pickUpLocation: true,
      pickUpReason: true,
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
    title: getPageTitle([
      `Modifier ${getAnimalDisplayName(animal)}`,
      "Situation",
    ]),
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
    await updateAnimalSituation(idResult.data, {
      adoptionDate: formData.data.adoptionDate ?? null,
      adoptionOption: formData.data.adoptionOption ?? null,
      comments: formData.data.comments || null,
      fosterFamilyId: formData.data.fosterFamilyId ?? null,
      isSterilizationMandatory:
        formData.data.isSterilized !==
        ActionFormData.schema.shape.isSterilized.Enum.NOT_MANDATORY,
      isSterilized:
        formData.data.isSterilized ===
        ActionFormData.schema.shape.isSterilized.Enum.YES,
      managerId: formData.data.managerId ?? null,
      nextVaccinationDate: formData.data.nextVaccinationDate ?? null,
      pickUpDate: formData.data.pickUpDate,
      pickUpLocation: formData.data.pickUpLocation ?? null,
      pickUpReason: formData.data.pickUpReason,
      status: formData.data.status,
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

    if (error instanceof MissingAdoptionDateError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              adoptionDate: ["Veuillez entrer une date"],
            },
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof MissingManagerError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              managerId: ["Veuillez choisir un responsable"],
            },
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof NotManagerError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              managerId: [
                "L’utilisateur choisi ne peux pas être un responsable",
              ],
            },
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof MissingPickUpLocationError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              pickUpLocation: ["Veuillez choisir un lieu"],
            },
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof MissingNextVaccinationError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              nextVaccinationDate: ["Veuillez entrer une date"],
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

export default function AnimalEditSituationPage() {
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
          <AnimalSituationForm defaultAnimal={animal} fetcher={fetcher} />
        </CardContent>
      </Card>
    </PageContent>
  );
}

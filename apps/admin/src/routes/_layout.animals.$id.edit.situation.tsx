import { UserGroup } from "@prisma/client";
import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, V2_MetaFunction } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { getAnimalDisplayName } from "~/animals/profile/name";
import {
  MissingAdoptionDateError,
  MissingManagerError,
  MissingNextVaccinationError,
  MissingPickUpLocationError,
  NotManagerError,
} from "~/animals/situation/db.server";
import { ActionFormData, AnimalSituationForm } from "~/animals/situation/form";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { db } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { prisma } from "~/core/prisma.server";
import { NotFoundResponse } from "~/core/response.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
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
      screeningFelv: true,
      screeningFiv: true,
      species: true,
      status: true,
    },
  });

  assertIsDefined(animal);

  return json({ animal });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const animal = data?.animal;
  if (animal == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [
    {
      title: getPageTitle([
        `Modifier ${getAnimalDisplayName(animal)}`,
        "Situation",
      ]),
    },
  ];
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionArgs) {
  const currentUser = await db.currentUser.get(request, {
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
  const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await db.animal.situation.update(idResult.data, {
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
      screeningFelv: formData.data.screeningFelv,
      screeningFiv: formData.data.screeningFiv,
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

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { animal } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout.Content className="flex flex-col items-center">
      <Card className="w-full md:max-w-[600px]">
        <Card.Header>
          <Card.Title>Modifier {animal.name}</Card.Title>
        </Card.Header>

        <Card.Content>
          <AnimalSituationForm defaultAnimal={animal} fetcher={fetcher} />
        </Card.Content>
      </Card>
    </PageLayout.Content>
  );
}

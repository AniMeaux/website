import { getAnimalDisplayName } from "#i/animals/profile/name";
import {
  MissingAdoptionDateError,
  MissingManagerError,
  MissingNextVaccinationError,
  MissingPickUpLocationError,
  NotManagerError,
} from "#i/animals/situation/db.server";
import { ActionFormData, AnimalSituationForm } from "#i/animals/situation/form";
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page";
import { db } from "#i/core/db.server";
import { NotFoundError } from "#i/core/errors.server";
import { assertIsDefined } from "#i/core/is-defined.server";
import { Card } from "#i/core/layout/card";
import { PageLayout } from "#i/core/layout/page";
import { Routes, useBackIfPossible } from "#i/core/navigation";
import { getPageTitle } from "#i/core/page-title";
import { prisma } from "#i/core/prisma.server";
import { notFound } from "#i/core/response.server";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { UserGroup } from "@animeaux/prisma";
import { zu } from "@animeaux/zod-utils";
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

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const animal = await prisma.animal.findUnique({
    where: { id: paramsResult.data.id },
    select: {
      adoptionDate: true,
      adoptionOption: true,
      alias: true,
      comments: true,
      diagnosis: true,
      fosterFamily: { select: { id: true, displayName: true } },
      gender: true,
      isSterilizationMandatory: true,
      isSterilized: true,
      isVaccinationMandatory: true,
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
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
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

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
    await db.animal.situation.update(
      paramsResult.data.id,
      {
        adoptionDate: formData.data.adoptionDate ?? null,
        adoptionOption: formData.data.adoptionOption ?? null,
        comments: formData.data.comments || null,
        diagnosis: formData.data.diagnosis,
        fosterFamilyId: formData.data.fosterFamilyId ?? null,
        isSterilizationMandatory:
          formData.data.isSterilized !==
          ActionFormData.schema.shape.isSterilized.Enum.NOT_MANDATORY,
        isSterilized:
          formData.data.isSterilized ===
          ActionFormData.schema.shape.isSterilized.Enum.YES,
        isVaccinationMandatory:
          formData.data.vaccination ===
          ActionFormData.schema.shape.vaccination.Enum.MANDATORY,
        managerId: formData.data.managerId ?? null,
        nextVaccinationDate: formData.data.nextVaccinationDate ?? null,
        pickUpDate: formData.data.pickUpDate,
        pickUpLocation: formData.data.pickUpLocation ?? null,
        pickUpReason: formData.data.pickUpReason,
        screeningFelv: formData.data.screeningFelv,
        screeningFiv: formData.data.screeningFiv,
        status: formData.data.status,
      },
      currentUser,
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["L’animal est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 },
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
        { status: 400 },
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
        { status: 400 },
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
        { status: 400 },
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
        { status: 400 },
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
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({
    redirectTo: Routes.animals.id(paramsResult.data.id).toString(),
  });
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { animal } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout.Root>
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
    </PageLayout.Root>
  );
}

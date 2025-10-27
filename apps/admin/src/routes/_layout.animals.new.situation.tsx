import { AnimalCreationSteps } from "#animals/creation-steps";
import {
  MissingAdoptionDateError,
  MissingManagerError,
  MissingPickUpLocationError,
  NotManagerError,
} from "#animals/situation/db.server";
import { ActionFormData, AnimalSituationForm } from "#animals/situation/form";
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
  const { draft, ...currentUser } = await db.currentUser.get(request, {
    select: {
      id: true,
      groups: true,
      displayName: true,
      draft: {
        include: {
          fosterFamily: { select: { id: true, displayName: true } },
          manager: { select: { id: true, displayName: true } },
        },
      },
    },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  await db.animal.profile.assertDraftIsValid(draft);

  return json({ draft, currentUser });
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle(["Nouvel animal", "Situation"]) }];
};

type ActionData = {
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true, draft: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  await db.animal.profile.assertDraftIsValid(currentUser.draft);

  const formData = ActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await db.animal.situation.updateDraft(currentUser.id, {
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
    });
  } catch (error) {
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

    throw error;
  }

  throw redirect(Routes.animals.new.pictures.toString());
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { currentUser, draft } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header isVertical>
            <Card.Title>Nouvel animal</Card.Title>
            <AnimalCreationSteps activeStep="situation" />
          </Card.Header>

          <Card.Content>
            <AnimalSituationForm
              isCreate
              currentUser={currentUser}
              defaultAnimal={draft}
              fetcher={fetcher}
            />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { AnimalCreationSteps } from "~/animals/creationSteps";
import { assertDraftHasValidProfile } from "~/animals/profile/db.server";
import {
  MissingAdoptionDateError,
  MissingManagerError,
  MissingPickUpLocationError,
  NotManagerError,
  updateAnimalSituationDraft,
} from "~/animals/situation/db.server";
import { ActionFormData, AnimalSituationForm } from "~/animals/situation/form";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request }: LoaderArgs) {
  const { draft, ...currentUser } = await getCurrentUser(request, {
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

  await assertDraftHasValidProfile(draft);

  return json({ draft, currentUser });
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle(["Nouvel animal", "Situation"]) };
};

type ActionData = {
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true, draft: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  await assertDraftHasValidProfile(currentUser.draft);

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
    await updateAnimalSituationDraft(currentUser.id, {
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

    throw error;
  }

  throw redirect("/animals/new/pictures");
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function Route() {
  const { currentUser, draft } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
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
  );
}

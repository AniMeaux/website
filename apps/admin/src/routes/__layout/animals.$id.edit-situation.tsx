import { getAnimalDisplayName } from "#/animals/profile/name";
import {
  MissingAdoptionDateError,
  MissingManagerError,
  NotManagerError,
  updateAnimalSituation,
} from "#/animals/situation/db.server";
import { ActionFormData, AnimalSituationForm } from "#/animals/situation/form";
import { ErrorPage, getErrorTitle } from "#/core/dataDisplay/errorPage";
import { prisma } from "#/core/db.server";
import { NotFoundError } from "#/core/errors.server";
import { assertIsDefined } from "#/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "#/core/layout/card";
import { getPageTitle } from "#/core/pageTitle";
import { NotFoundResponse } from "#/core/response.server";
import {
  ActionConfirmationSearchParams,
  ActionConfirmationType,
} from "#/core/searchParams";
import { getCurrentUser } from "#/currentUser/db.server";
import { assertCurrentUserHasGroups } from "#/currentUser/groups.server";
import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, useCatch, useLoaderData } from "@remix-run/react";
import { createPath } from "history";
import { z } from "zod";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
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
      id: true,
      manager: { select: { id: true, displayName: true } },
      name: true,
      pickUpDate: true,
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

  return { title: getPageTitle(getAnimalDisplayName(animal)) };
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
    await updateAnimalSituation(formData.data.id, {
      adoptionDate: formData.data.adoptionDate ?? null,
      adoptionOption: formData.data.adoptionOption ?? null,
      comments: formData.data.comments || null,
      managerId: formData.data.managerId ?? null,
      pickUpDate: formData.data.pickUpDate,
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

    throw error;
  }

  throw redirect(
    createPath({
      pathname: `/animals/${formData.data.id}`,
      search: new ActionConfirmationSearchParams()
        .setConfirmation(ActionConfirmationType.EDIT)
        .toString(),
    })
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function AnimalEditSituationPage() {
  const { animal } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Modifier {animal.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <AnimalSituationForm animal={animal} errors={actionData?.errors} />
        </CardContent>
      </Card>
    </main>
  );
}

import { db } from "#core/db.server";
import { EmailAlreadyUsedError, NotFoundError } from "#core/errors.server";
import { Routes } from "#core/navigation";
import { notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import {
  InvalidAvailabilityDateError,
  MissingSpeciesToHostError,
} from "#foster-families/db.server";
import { ActionFormData } from "#foster-families/form";
import type { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { routeParamsSchema } from "./route-params";

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = routeParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  const rawFormData = await request.formData();
  const formData = ActionFormData.safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await db.fosterFamily.update(
      paramsResult.data.id,
      {
        address: formData.data.address,
        availability: formData.data.availability,
        availabilityExpirationDate:
          formData.data.availabilityExpirationDate ?? null,
        city: formData.data.city,
        comments: formData.data.comments || null,
        displayName: formData.data.displayName,
        email: formData.data.email,
        garden: formData.data.garden,
        housing: formData.data.housing,
        phone: formData.data.phone,
        speciesAlreadyPresent: formData.data.speciesAlreadyPresent,
        speciesToHost: formData.data.speciesToHost,
        zipCode: formData.data.zipCode,
      },
      currentUser,
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["La famille d’accueil est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 },
      );
    }

    if (error instanceof EmailAlreadyUsedError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: { email: ["L’email est déjà utilisé"] },
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof MissingSpeciesToHostError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              speciesToHost: ["Veuillez choisir au moins une espèces"],
            },
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof InvalidAvailabilityDateError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              availabilityExpirationDate: ["Veuillez choisir une date à venir"],
            },
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({
    redirectTo: Routes.fosterFamilies.id(paramsResult.data.id).toString(),
  });
}

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

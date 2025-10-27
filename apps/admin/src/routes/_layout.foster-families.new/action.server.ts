import { db } from "#core/db.server";
import { EmailAlreadyUsedError } from "#core/errors.server";
import { Routes } from "#core/navigation";
import { NextSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import {
  InvalidAvailabilityDateError,
  MissingSpeciesToHostError,
} from "#foster-families/db.server";
import { ActionFormData } from "#foster-families/form";
import { UserGroup } from "@animeaux/prisma/server";
import type { zu } from "@animeaux/zod-utils";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const rawFormData = await request.formData();
  const formData = ActionFormData.safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const fosterFamilyId = await db.fosterFamily.create(
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

    const url = new URL(request.url);
    const { next } = NextSearchParams.parse(url.searchParams);

    if (next == null) {
      // Redirect instead of going back so we can display the newly created
      // foster family.
      throw redirect(Routes.fosterFamilies.id(fosterFamilyId).toString());
    }

    return json<ActionData>({ redirectTo: next });
  } catch (error) {
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
}

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

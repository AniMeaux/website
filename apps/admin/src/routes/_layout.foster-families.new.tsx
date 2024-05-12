import { ErrorPage } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { EmailAlreadyUsedError } from "#core/errors.server";
import { PageLayout } from "#core/layout/page";
import { Routes, useBackIfPossible } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { NextSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import {
  InvalidAvailabilityDateError,
  MissingSpeciesToHostError,
} from "#foster-families/db.server";
import { ActionFormData, FosterFamilyForm } from "#foster-families/form";
import type { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Nouvelle famille d’accueil") }];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
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
    const fosterFamilyId = await db.fosterFamily.create({
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
    });

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

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <FosterFamilyForm fetcher={fetcher} />
      </PageLayout.Content>
    </PageLayout>
  );
}

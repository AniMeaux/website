import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { EmailAlreadyUsedError, NotFoundError } from "#core/errors.server";
import { assertIsDefined } from "#core/is-defined.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes, useBackIfPossible } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { NotFoundResponse } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import {
  InvalidAvailabilityDateError,
  MissingSpeciesToHostError,
} from "#foster-families/db.server";
import { ActionFormData, FosterFamilyForm } from "#foster-families/form";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
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
    throw new NotFoundResponse();
  }

  const fosterFamily = await prisma.fosterFamily.findUnique({
    where: { id: paramsResult.data.id },
    select: {
      address: true,
      availability: true,
      availabilityExpirationDate: true,
      city: true,
      comments: true,
      displayName: true,
      email: true,
      garden: true,
      housing: true,
      phone: true,
      speciesAlreadyPresent: true,
      speciesToHost: true,
      zipCode: true,
    },
  });

  assertIsDefined(fosterFamily);

  return json({ fosterFamily });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily;
  if (fosterFamily == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Modifier ${fosterFamily.displayName}`) }];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw new NotFoundResponse();
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
    await db.fosterFamily.update(paramsResult.data.id, {
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

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { fosterFamily } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Modifier {fosterFamily.displayName}</Card.Title>
          </Card.Header>

          <Card.Content>
            <FosterFamilyForm
              defaultFosterFamily={fosterFamily}
              fetcher={fetcher}
            />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}

import { ErrorPage } from "#core/dataDisplay/errorPage.tsx";
import { db } from "#core/db.server.ts";
import { EmailAlreadyUsedError } from "#core/errors.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes, useBackIfPossible } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { NextSearchParams } from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { MissingSpeciesToHostError } from "#fosterFamilies/db.server.ts";
import { ActionFormData, FosterFamilyForm } from "#fosterFamilies/form.tsx";
import type { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { V2_MetaFunction } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return new Response("Ok");
}

export const meta: V2_MetaFunction = () => {
  return [{ title: getPageTitle("Nouvelle famille d’accueil") }];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
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
      city: formData.data.city,
      comments: formData.data.comments || null,
      displayName: formData.data.displayName,
      email: formData.data.email,
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
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Nouvelle famille d’accueil</Card.Title>
          </Card.Header>

          <Card.Content>
            <FosterFamilyForm fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}

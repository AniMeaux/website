import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { EmailAlreadyUsedError } from "~/core/errors.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NextSearchParams } from "~/core/searchParams";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import {
  createFosterFamily,
  MissingSpeciesToHostError,
} from "~/fosterFamilies/db.server";
import { ActionFormData, FosterFamilyForm } from "~/fosterFamilies/form";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Nouvelle famille d’accueil") };
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const rawFormData = await request.formData();
  const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const fosterFamilyId = await createFosterFamily({
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
    const searchParams = new NextSearchParams(url.searchParams);
    const next = searchParams.getNext();

    if (next == null) {
      // Redirect instead of going back so we can display the newly created
      // foster family.
      throw redirect(`/foster-families/${fosterFamilyId}`);
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
        { status: 400 }
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
        { status: 400 }
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

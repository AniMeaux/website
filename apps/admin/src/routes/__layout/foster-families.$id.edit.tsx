import { UserGroup } from "@prisma/client";
import { ActionArgs, json, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { prisma } from "~/core/db.server";
import { EmailAlreadyUsedError, NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import {
  MissingSpeciesToHostError,
  updateFosterFamily,
} from "~/fosterFamilies/db.server";
import { ActionFormData, FosterFamilyForm } from "~/fosterFamilies/form";

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

  const fosterFamily = await prisma.fosterFamily.findUnique({
    where: { id: result.data },
    select: {
      address: true,
      city: true,
      comments: true,
      displayName: true,
      email: true,
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
    return { title: getPageTitle(getErrorTitle(404)) };
  }

  return { title: getPageTitle(fosterFamily.displayName) };
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const idResult = z.string().uuid().safeParse(params["id"]);
  if (!idResult.success) {
    throw new NotFoundResponse();
  }

  const rawFormData = await request.formData();
  const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await updateFosterFamily(idResult.data, {
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
  } catch (error) {
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["La famille d’accueil est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 }
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

  return json<ActionData>({ redirectTo: `/foster-families/${idResult.data}` });
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function FosterFamilyEditPage() {
  const { fosterFamily } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Modifier {fosterFamily.displayName}</CardTitle>
        </CardHeader>

        <CardContent>
          <FosterFamilyForm
            defaultFosterFamily={fosterFamily}
            fetcher={fetcher}
          />
        </CardContent>
      </Card>
    </main>
  );
}

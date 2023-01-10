import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { updateAnimalPictures } from "~/animals/pictures/db.server";
import { ActionFormData, AnimalPicturesForm } from "~/animals/pictures/form";
import { getAnimalDisplayName } from "~/animals/profile/name";
import {
  CloudinaryUploadApiError,
  createCloudinaryUploadHandler,
} from "~/core/cloudinary.server";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

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
      alias: true,
      avatar: true,
      name: true,
      pictures: true,
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

  return {
    title: getPageTitle([`Modifier ${getAnimalDisplayName(animal)}`, "Photos"]),
  };
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

  try {
    const rawFormData = await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        createCloudinaryUploadHandler({
          filter: ({ name }) => name === ActionFormData.keys.pictures,
        }),
        unstable_createMemoryUploadHandler({
          filter: ({ contentType }) => contentType == null,
        })
      )
    );

    const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);
    if (!formData.success) {
      return json<ActionData>(
        { errors: formData.error.flatten() },
        { status: 400 }
      );
    }

    await updateAnimalPictures(idResult.data, {
      avatar: formData.data.pictures[0],
      pictures: formData.data.pictures.slice(1),
    });
  } catch (error) {
    if (error instanceof CloudinaryUploadApiError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [error.message],
            fieldErrors: {},
          },
        },
        { status: error.status }
      );
    }

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

    throw error;
  }

  return json<ActionData>({ redirectTo: `/animals/${idResult.data}` });
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function AnimalEditProfilePage() {
  const { animal } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader>
          <CardTitle>Modifier {animal.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <AnimalPicturesForm defaultAnimal={animal} fetcher={fetcher} />
        </CardContent>
      </Card>
    </main>
  );
}

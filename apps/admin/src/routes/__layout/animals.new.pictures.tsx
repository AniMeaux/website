import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  MetaFunction,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useCatch, useFetcher } from "@remix-run/react";
import { createPath } from "history";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { AnimalCreationSteps } from "~/animals/creationSteps";
import { createAnimal } from "~/animals/db.server";
import { ActionFormData, AnimalPicturesForm } from "~/animals/pictures/form";
import { assertDraftHasValidProfile } from "~/animals/profile/db.server";
import { assertDraftHasValidSituation } from "~/animals/situation/db.server";
import {
  CloudinaryUploadApiError,
  createCloudinaryUploadHandler,
} from "~/core/cloudinary.server";
import { ErrorPage } from "~/core/dataDisplay/errorPage";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/layout/card";
import { getPageTitle } from "~/core/pageTitle";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true, draft: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  await assertDraftHasValidProfile(currentUser.draft);
  await assertDraftHasValidSituation(currentUser.draft);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle(["Nouvel animal", "Photos"]) };
};

type ActionData = {
  redirectTo?: string;
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
  await assertDraftHasValidSituation(currentUser.draft);

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

    const animalId = await createAnimal(currentUser.draft, {
      avatar: formData.data.pictures[0],
      pictures: formData.data.pictures.slice(1),
    });

    // Redirect instead of going back so we can display the newly created
    // animal.
    throw redirect(createPath({ pathname: `/animals/${animalId}` }));
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

    throw error;
  }
}

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

export default function NewAnimalSituationPage() {
  const fetcher = useFetcher<typeof action>();

  return (
    <main className="w-full flex flex-col md:max-w-[600px]">
      <Card>
        <CardHeader isVertical>
          <CardTitle>Nouvel animal</CardTitle>
          <AnimalCreationSteps activeStep="pictures" />
        </CardHeader>

        <CardContent>
          <AnimalPicturesForm isCreate fetcher={fetcher} />
        </CardContent>
      </Card>
    </main>
  );
}

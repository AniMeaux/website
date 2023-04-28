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
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { getPageTitle } from "~/core/pageTitle";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true, draft: true },
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
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true, draft: true },
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
    throw redirect(`/animals/${animalId}`);
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

export default function Route() {
  const fetcher = useFetcher<typeof action>();

  return (
    <PageLayout.Content className="flex flex-col items-center">
      <Card className="w-full md:max-w-[600px]">
        <Card.Header isVertical>
          <Card.Title>Nouvel animal</Card.Title>
          <AnimalCreationSteps activeStep="pictures" />
        </Card.Header>

        <Card.Content>
          <AnimalPicturesForm fetcher={fetcher} />
        </Card.Content>
      </Card>
    </PageLayout.Content>
  );
}

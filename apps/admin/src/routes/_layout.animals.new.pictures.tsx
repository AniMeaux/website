import { AnimalCreationSteps } from "#animals/creation-steps";
import { ActionFormData, AnimalPicturesForm } from "#animals/pictures/form";
import {
  CloudinaryUploadApiError,
  createCloudinaryUploadHandler,
} from "#core/cloudinary.server";
import { ErrorPage } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserGroup } from "@animeaux/prisma";
import type { zu } from "@animeaux/zod-utils";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true, draft: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  await db.animal.profile.assertDraftIsValid(currentUser.draft);
  await db.animal.situation.assertDraftIsValid(currentUser.draft);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle(["Nouvel animal", "Photos"]) }];
};

type ActionData = {
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true, draft: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  await db.animal.profile.assertDraftIsValid(currentUser.draft);
  await db.animal.situation.assertDraftIsValid(currentUser.draft);

  try {
    const rawFormData = await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        createCloudinaryUploadHandler({
          filter: ({ name }) => name === ActionFormData.keys.pictures,
        }),
        unstable_createMemoryUploadHandler({
          filter: ({ contentType }) => contentType == null,
        }),
      ),
    );

    const formData = ActionFormData.safeParse(rawFormData);
    if (!formData.success) {
      return json<ActionData>(
        { errors: formData.error.flatten() },
        { status: 400 },
      );
    }

    const avatar = formData.data.pictures[0];
    invariant(avatar != null, "The avatar should exists");

    const animalId = await db.animal.create(
      currentUser.draft,
      {
        avatar,
        pictures: formData.data.pictures.slice(1),
      },
      currentUser,
    );

    // Redirect instead of going back so we can display the newly created
    // animal.
    throw redirect(Routes.animals.id(animalId).toString());
  } catch (error) {
    if (error instanceof CloudinaryUploadApiError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [error.message],
            fieldErrors: {},
          },
        },
        { status: error.status },
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

  return (
    <PageLayout.Root>
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
    </PageLayout.Root>
  );
}

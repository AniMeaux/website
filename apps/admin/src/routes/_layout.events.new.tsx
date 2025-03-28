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
import { InvalidDateRangeError } from "#events/db.server";
import { ActionFormData, EventForm } from "#events/form";
import type { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Nouvel évènement") }];
};

type ActionData = {
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const cloudinaryUploadHandler = createCloudinaryUploadHandler({
    filter: ({ name }) => name === ActionFormData.keys.image,
  });

  try {
    const rawFormData = await unstable_parseMultipartFormData(
      request,
      unstable_composeUploadHandlers(
        cloudinaryUploadHandler,
        unstable_createMemoryUploadHandler({
          filter: ({ contentType }) => contentType == null,
        }),
      ),
    );

    const formData = ActionFormData.safeParse(rawFormData);
    if (!formData.success) {
      await cloudinaryUploadHandler.revert();
      return json<ActionData>(
        { errors: formData.error.flatten() },
        { status: 400 },
      );
    }

    const eventId = await db.event.create({
      description: formData.data.description,
      endDate: formData.data.endDate,
      image: formData.data.image,
      isFullDay: formData.data.isFullDay,
      isVisible: !formData.data.isDraft,
      location: formData.data.location,
      startDate: formData.data.startDate,
      title: formData.data.title,
      url: formData.data.url || null,
    });

    throw redirect(Routes.events.id(eventId).toString());
  } catch (error) {
    if (error instanceof Error) {
      await cloudinaryUploadHandler.revert();
    }

    if (error instanceof CloudinaryUploadApiError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: { image: [error.message] },
          },
        },
        { status: error.status },
      );
    }

    if (error instanceof InvalidDateRangeError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              endDate: [
                "Veuillez choisir une date de fin postérieur à la date de début.",
              ],
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

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Nouvel évènement</Card.Title>
          </Card.Header>

          <Card.Content>
            <EventForm fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

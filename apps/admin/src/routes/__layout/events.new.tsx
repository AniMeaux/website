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
import { createEvent, InvalidDateRangeError } from "~/events/db.server";
import { ActionFormData, EventForm } from "~/events/form";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  return new Response("Ok");
}

export const meta: MetaFunction = () => {
  return { title: getPageTitle("Nouvel évènement") };
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
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
        })
      )
    );

    const formData = zfd.formData(ActionFormData.schema).safeParse(rawFormData);
    if (!formData.success) {
      await cloudinaryUploadHandler.revert();
      return json<ActionData>(
        { errors: formData.error.flatten() },
        { status: 400 }
      );
    }

    const eventId = await createEvent({
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

    throw redirect(`/events/${eventId}`);
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
        { status: error.status }
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
        { status: 400 }
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
    <PageLayout>
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
    </PageLayout>
  );
}

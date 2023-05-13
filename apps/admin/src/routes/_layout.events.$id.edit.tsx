import { UserGroup } from "@prisma/client";
import {
  ActionArgs,
  json,
  LoaderArgs,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData, V2_MetaFunction } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  CloudinaryUploadApiError,
  createCloudinaryUploadHandler,
} from "~/core/cloudinary.server";
import { ErrorPage, getErrorTitle } from "~/core/dataDisplay/errorPage";
import { prisma } from "~/core/db.server";
import { NotFoundError } from "~/core/errors.server";
import { assertIsDefined } from "~/core/isDefined.server";
import { Card } from "~/core/layout/card";
import { PageLayout } from "~/core/layout/page";
import { useBackIfPossible } from "~/core/navigation";
import { getPageTitle } from "~/core/pageTitle";
import { NotFoundResponse } from "~/core/response.server";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { InvalidDateRangeError, updateEvent } from "~/events/db.server";
import { ActionFormData, EventForm } from "~/events/form";

export async function loader({ request, params }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const result = z.string().uuid().safeParse(params["id"]);
  if (!result.success) {
    throw new NotFoundResponse();
  }

  const event = await prisma.event.findUnique({
    where: { id: result.data },
    select: {
      description: true,
      endDate: true,
      image: true,
      isFullDay: true,
      isVisible: true,
      location: true,
      startDate: true,
      title: true,
      url: true,
    },
  });

  assertIsDefined(event);

  return json({ event });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const event = data?.event;
  if (event == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Modifier ${event.title}`) }];
};

type ActionData = {
  redirectTo?: string;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const idResult = z.string().uuid().safeParse(params["id"]);
  if (!idResult.success) {
    throw new NotFoundResponse();
  }

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

    await updateEvent(idResult.data, {
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

    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["L'évènement est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 }
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

  return json<ActionData>({ redirectTo: `/events/${idResult.data}` });
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { event } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <PageLayout>
      <PageLayout.Content className="flex flex-col items-center">
        <Card className="w-full md:max-w-[600px]">
          <Card.Header>
            <Card.Title>Modifier {event.title}</Card.Title>
          </Card.Header>

          <Card.Content>
            <EventForm defaultEvent={event} fetcher={fetcher} />
          </Card.Content>
        </Card>
      </PageLayout.Content>
    </PageLayout>
  );
}

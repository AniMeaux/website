import {
  CloudinaryUploadApiError,
  createCloudinaryUploadHandler,
} from "#core/cloudinary.server.ts";
import { ErrorPage, getErrorTitle } from "#core/dataDisplay/errorPage.tsx";
import { db } from "#core/db.server.ts";
import { NotFoundError } from "#core/errors.server.ts";
import { assertIsDefined } from "#core/isDefined.server.ts";
import { Card } from "#core/layout/card.tsx";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes, useBackIfPossible } from "#core/navigation.ts";
import { getPageTitle } from "#core/pageTitle.ts";
import { prisma } from "#core/prisma.server.ts";
import { NotFoundResponse } from "#core/response.server.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { InvalidDateRangeError } from "#events/db.server.ts";
import { ActionFormData, EventForm } from "#events/form.tsx";
import { zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

const ParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw new NotFoundResponse();
  }

  const event = await prisma.event.findUnique({
    where: { id: paramsResult.data.id },
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const event = data?.event;
  if (event == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(`Modifier ${event.title}`) }];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const paramsResult = ParamsSchema.safeParse(params);
  if (!paramsResult.success) {
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

    await db.event.update(paramsResult.data.id, {
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
        { status: error.status },
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
        { status: 404 },
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

  return json<ActionData>({
    redirectTo: Routes.events.id(paramsResult.data.id).toString(),
  });
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

import { Action } from "#core/actions";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { NotFoundError } from "#core/errors.server";
import { Form } from "#core/form-elements/form";
import { RadioInput, RadioInputList } from "#core/form-elements/radio-input";
import { RequiredStar } from "#core/form-elements/required-star";
import { Textarea } from "#core/form-elements/textarea";
import { assertIsDefined } from "#core/is-defined.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes, useBackIfPossible } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { MissingRefusalMessageError } from "#show/exhibitors/applications/db.server";
import {
  SORTED_STATUSES,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#show/exhibitors/applications/status";
import { FormDataDelegate } from "@animeaux/form-data";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import { ShowExhibitorApplicationStatus, UserGroup } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const application = await db.show.exhibitor.application.findUnique(
    routeParams.applicationId,
    {
      select: {
        status: true,
        refusalMessage: true,
        structureName: true,
      },
    },
  );

  assertIsDefined(application);

  return json({ application });
}

const RouteParamsSchema = zu.object({
  applicationId: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.application.structureName != null
          ? `Modifier la candidature de ${data.application.structureName}`
          : getErrorTitle(404),
      ),
    },
  ];
};

type ActionData = {
  redirectTo?: string;
  errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
};

const ActionFormData = FormDataDelegate.create(
  zu.object({
    status: zu.nativeEnum(ShowExhibitorApplicationStatus),
    refusalMessage: zu.string().trim().optional(),
  }),
);

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = RouteParamsSchema.safeParse(params);
  if (!routeParams.success) {
    throw notFound();
  }

  const rawFormData = await request.formData();
  const formData = ActionFormData.safeParse(rawFormData);
  if (!formData.success) {
    return json<ActionData>(
      { errors: formData.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await db.show.exhibitor.application.update(routeParams.data.applicationId, {
      status: formData.data.status,
      refusalMessage: formData.data.refusalMessage || null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: ["La candidature est introuvable."],
            fieldErrors: {},
          },
        },
        { status: 404 },
      );
    }

    if (error instanceof MissingRefusalMessageError) {
      return json<ActionData>(
        {
          errors: {
            formErrors: [],
            fieldErrors: {
              refusalMessage: ["Veuillez écrire un message"],
            },
          },
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({
    redirectTo: Routes.show.applications
      .id(routeParams.data.applicationId)
      .toString(),
  });
}

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Content className="flex flex-col items-center">
      <Card className="w-full md:max-w-[600px]">
        <Card.Header>
          <Card.Title>
            Modifier la candidature de {application.structureName}
          </Card.Title>
        </Card.Header>

        <Card.Content>
          <ApplicationForm />
        </Card.Content>
      </Card>
    </PageLayout.Content>
  );
}

function ApplicationForm() {
  const { application } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  const refusalMessageRef = useRef<HTMLTextAreaElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.refusalMessage != null) {
        refusalMessageRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  const [statusState, setStatusState] = useState(application.status);

  return (
    <Form asChild hasHeader>
      <fetcher.Form method="POST" noValidate>
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Statut <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_STATUSES.map((status) => (
                <RadioInput
                  key={status}
                  label={TRANSLATION_BY_APPLICATION_STATUS[status]}
                  name={ActionFormData.keys.status}
                  value={status}
                  checked={statusState === status}
                  onChange={() => setStatusState(status)}
                />
              ))}
            </RadioInputList>
          </Form.Field>

          {statusState === ShowExhibitorApplicationStatus.REFUSED ? (
            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.refusalMessage}>
                Message de refus
              </Form.Label>

              <Textarea
                ref={refusalMessageRef}
                id={ActionFormData.keys.refusalMessage}
                name={ActionFormData.keys.refusalMessage}
                defaultValue={application.refusalMessage ?? undefined}
                rows={5}
                hasError={
                  fetcher.data?.errors?.fieldErrors.refusalMessage != null
                }
                aria-describedby={
                  fetcher.data?.errors?.fieldErrors.refusalMessage != null
                    ? "refusal-message-error"
                    : "refusal-message-helper"
                }
              />

              {fetcher.data?.errors?.fieldErrors.refusalMessage != null ? (
                <Form.ErrorMessage id="refusal-message-error">
                  {fetcher.data.errors.fieldErrors.refusalMessage}
                </Form.ErrorMessage>
              ) : (
                <Form.HelperMessage id="refusal-message-helper">
                  Sera envoyé dans l’email de notification
                </Form.HelperMessage>
              )}
            </Form.Field>
          ) : null}
        </Form.Fields>

        <Form.Action asChild>
          <Action>Enregistrer</Action>
        </Form.Action>
      </fetcher.Form>
    </Form>
  );
}

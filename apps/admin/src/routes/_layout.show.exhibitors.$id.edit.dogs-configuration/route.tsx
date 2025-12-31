import { Action } from "#i/core/actions.js";
import { ErrorPage, getErrorTitle } from "#i/core/data-display/error-page.js";
import { db } from "#i/core/db.server.js";
import { PageLayout } from "#i/core/layout/page.js";
import { Routes } from "#i/core/navigation.js";
import { getPageTitle } from "#i/core/page-title.js";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js";
import { UserGroup } from "@animeaux/prisma";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import type { SubmissionResult } from "@conform-to/react";
import { getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import type { MergeExclusive } from "type-fest";
import { ActionSchema } from "./action";
import { FieldsetStatus } from "./fieldset-status";
import { FormProvider, useFormRoot } from "./form";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await db.show.exhibitor.findUnique(routeParams.id, {
    select: {
      name: true,
      dogsConfigurationStatus: true,
      dogsConfigurationStatusMessage: true,
    },
  });

  return json({ exhibitor });
}

const RouteParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.exhibitor.name != null
          ? [`Modifier ${data.exhibitor.name}`, "Chiens sur stand"]
          : getErrorTitle(404),
      ),
    },
  ];
};

type ActionData = MergeExclusive<
  { redirectTo: string },
  { submissionResult: SubmissionResult<string[]> }
>;

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json<ActionData>(
      { submissionResult: submission.reply() },
      { status: 400 },
    );
  }

  await db.show.exhibitor.updateDogs(routeParams.id, {
    dogsConfigurationStatus: submission.value.status,
    dogsConfigurationStatusMessage: submission.value.statusMessage || null,
  });

  return json<ActionData>({
    redirectTo: Routes.show.exhibitors.id(routeParams.id).toString(),
  });
}

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  const [form, fields, fetcher] = useFormRoot();

  return (
    <FormProvider form={form} fields={fields}>
      <PageLayout.Content className="grid grid-cols-1 justify-center md:grid-cols-[minmax(0,600px)]">
        <fetcher.Form
          {...getFormProps(form)}
          method="POST"
          className="grid grid-cols-1 gap-1 md:gap-2"
        >
          <FieldsetStatus />

          <Action type="submit" className="mx-1.5 md:mx-0 md:justify-self-end">
            Enregistrer
            <Action.Loader isLoading={fetcher.state !== "idle"} />
          </Action>
        </fetcher.Form>
      </PageLayout.Content>
    </FormProvider>
  );
}

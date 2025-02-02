import { Action } from "#core/actions";
import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import type { SubmissionResult } from "@conform-to/react";
import { getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";
import type { MergeExclusive } from "type-fest";
import { ActionSchema } from "./action";
import { FieldsetSituation } from "./fieldset-situation";
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

  const { profile, exhbitor, standConfiguration } = await promiseHash({
    profile: db.show.exhibitor.profile.findUniqueByExhibitor(routeParams.id, {
      select: { name: true },
    }),

    exhbitor: db.show.exhibitor.findUnique(routeParams.id, {
      select: { hasPaid: true, isVisible: true },
    }),

    standConfiguration:
      db.show.exhibitor.standConfiguration.findUniqueByExhibitor(
        routeParams.id,
        { select: { locationNumber: true, standNumber: true } },
      ),
  });

  return json({ profile, exhbitor, standConfiguration });
}

const RouteParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.profile.name != null
          ? [`Modifier ${data.profile.name}`, "Situation"]
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

  await db.show.exhibitor.update(routeParams.id, {
    hasPaid: submission.value.hasPaid,
    isVisible: submission.value.isVisible,
    locationNumber: submission.value.locationNumber || null,
    standNumber: submission.value.standNumber || null,
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
          <FieldsetSituation />

          <Action type="submit" className="mx-1.5 md:mx-0 md:justify-self-end">
            Enregistrer
            <Action.Loader isLoading={fetcher.state !== "idle"} />
          </Action>
        </fetcher.Form>
      </PageLayout.Content>
    </FormProvider>
  );
}

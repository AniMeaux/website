import { db } from "#core/db.server";
import { Routes } from "#core/navigation";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MergeExclusive } from "type-fest";
import { actionSchema } from "./action-schema";
import { routeParamsSchema } from "./route-params";

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: actionSchema });

  if (submission.status !== "success") {
    return json<ActionData>(
      { submissionResult: submission.reply() },
      { status: 400 },
    );
  }

  await db.show.exhibitor.update(routeParams.id, {
    isOrganizer: submission.value.isOrganizer,
    isVisible: submission.value.isVisible,
    locationNumber: submission.value.locationNumber || null,
    standNumber: submission.value.standNumber || null,
  });

  return json<ActionData>({
    redirectTo: Routes.show.exhibitors.id(routeParams.id).toString(),
  });
}

type ActionData = MergeExclusive<
  { redirectTo: string },
  { submissionResult: SubmissionResult<string[]> }
>;

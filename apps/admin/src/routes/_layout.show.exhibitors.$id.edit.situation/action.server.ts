import { db } from "#i/core/db.server";
import { Routes } from "#i/core/navigation";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
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
    isOrganizersFavorite: submission.value.isOrganizersFavorite,
    isRisingStar: submission.value.isRisingStar,
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

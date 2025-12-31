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
import { ActionSchema } from "./action.js";
import { RouteParamsSchema } from "./route-params.js";

export type ActionData = MergeExclusive<
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

  await db.show.exhibitor.updateStand(routeParams.id, {
    chairCount: submission.value.chairCount,
    dividerCount: submission.value.dividerCount,
    dividerTypeId: submission.value.dividerType ?? null,
    hasCorner: submission.value.hasCorner,
    hasElectricalConnection: submission.value.hasElectricalConnection,
    hasTableCloths: submission.value.hasTableCloths,
    installationDay: submission.value.installationDay,
    peopleCount: submission.value.peopleCount,
    sizeId: submission.value.sizeId,
    standConfigurationStatus: submission.value.status,
    standConfigurationStatusMessage: submission.value.statusMessage || null,
    tableCount: submission.value.tableCount,
  });

  return json<ActionData>({
    redirectTo: Routes.show.exhibitors.id(routeParams.id).toString(),
  });
}

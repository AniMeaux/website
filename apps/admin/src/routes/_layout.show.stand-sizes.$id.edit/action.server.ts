import { db } from "#i/core/db.server.js";
import { NotFoundError } from "#i/core/errors.server.js";
import { Routes } from "#i/core/navigation.js";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js";
import { actionSchema } from "#i/show/stand-size/action-schema";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MergeExclusive } from "type-fest";
import { routeParamsSchema } from "./route-params";

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: actionSchema });

  if (submission.status !== "success") {
    return json<ActionData>(
      { submissionResult: submission.reply() },
      { status: 400 },
    );
  }

  try {
    await db.show.standSize.update(routeParams.id, {
      area: submission.value.area,
      isVisible: submission.value.isVisible,
      label: submission.value.label,
      maxBraceletCount:
        submission.value.maxPeopleCountIncluded +
        submission.value.maxPeopleCountAdditional,
      maxCount: submission.value.maxCount,
      maxDividerCount: submission.value.maxDividerCount,
      maxPeopleCount: submission.value.maxPeopleCountIncluded,
      maxTableCount: submission.value.maxTableCount,
      priceForAssociations: submission.value.priceForAssociations ?? null,
      priceForServices: submission.value.priceForServices ?? null,
      priceForShops: submission.value.priceForShops ?? null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return json<ActionData>(
        {
          submissionResult: submission.reply({
            formErrors: ["La taille de stand est introuvable."],
          }),
        },
        { status: 404 },
      );
    }

    throw error;
  }

  return json<ActionData>({
    redirectTo: Routes.show.standSizes.id(routeParams.id).toString(),
  });
}

type ActionData = MergeExclusive<
  { redirectTo: string },
  { submissionResult: SubmissionResult<string[]> }
>;

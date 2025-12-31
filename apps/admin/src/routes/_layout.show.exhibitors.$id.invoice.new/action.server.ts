import { db } from "#i/core/db.server.js";
import { AlreadyExistError } from "#i/core/errors.server.js";
import { Routes } from "#i/core/navigation.js";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server.js";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MergeExclusive } from "type-fest";
import { actionSchema } from "./action";
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

  try {
    await db.show.invoice.create({
      exhibitorId: routeParams.id,
      amount: submission.value.amount,
      dueDate: submission.value.dueDate,
      number: submission.value.number,
      status: submission.value.status,
      url: submission.value.url,
    });
  } catch (error) {
    if (error instanceof AlreadyExistError) {
      return json<ActionData>(
        {
          submissionResult: submission.reply({
            fieldErrors: { number: ["Le numéro est déjà utilisé"] },
          }),
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({
    redirectTo: Routes.show.exhibitors.id(routeParams.id).toString(),
  });
}

type ActionData = MergeExclusive<
  { redirectTo: string },
  { submissionResult: SubmissionResult<string[]> }
>;

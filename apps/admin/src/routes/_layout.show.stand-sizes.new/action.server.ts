import { db } from "#core/db.server.js";
import { AlreadyExistError } from "#core/errors.server.js";
import { Routes } from "#core/navigation.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { actionSchema } from "#show/stand-size/action-schema";
import { catchError } from "@animeaux/core";
import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MergeExclusive } from "type-fest";

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: actionSchema });

  if (submission.status !== "success") {
    return json<ActionData>(
      { submissionResult: submission.reply() },
      { status: 400 },
    );
  }

  const [error, standSizeId] = await catchError(() =>
    db.show.standSize.create({
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
    }),
  );

  if (error != null) {
    if (error instanceof AlreadyExistError) {
      return json<ActionData>(
        {
          submissionResult: submission.reply({
            fieldErrors: { label: ["La taille de stand existe déjà"] },
          }),
        },
        { status: 400 },
      );
    }

    throw error;
  }

  return json<ActionData>({
    redirectTo: Routes.show.standSizes.id(standSizeId).toString(),
  });
}

type ActionData = MergeExclusive<
  { redirectTo: string },
  { submissionResult: SubmissionResult<string[]> }
>;

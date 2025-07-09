import { db } from "#core/db.server";
import { NotFoundError, ReferencedError } from "#core/errors.server";
import { Routes } from "#core/navigation";
import { badRequest, notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import type { FosterFamily } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { BanActionFormData } from "./card-actions";
import { RouteParamsSchema } from "./route-params";

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const paramsResult = RouteParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    throw notFound();
  }

  if (request.method.toUpperCase() === "DELETE") {
    return await actionDelete({ fosterFamilyId: paramsResult.data.id });
  }

  return await actionBan({
    request,
    fosterFamilyId: paramsResult.data.id,
  });
}

type ActionData = {
  errors?: string[];
};

async function actionDelete({
  fosterFamilyId,
}: {
  fosterFamilyId: FosterFamily["id"];
}) {
  try {
    await db.fosterFamily.delete(fosterFamilyId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    if (error instanceof ReferencedError) {
      return json<ActionData>(
        {
          errors: [
            "La famille d’accueil ne peut être supprimée tant qu’elle a des animaux accueillis.",
          ],
        },
        { status: 400 },
      );
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing foster family.
  throw redirect(Routes.fosterFamilies.toString());
}

async function actionBan({
  fosterFamilyId,
  request,
}: Pick<ActionFunctionArgs, "request"> & {
  fosterFamilyId: FosterFamily["id"];
}) {
  const formData = BanActionFormData.safeParse(await request.formData());
  if (!formData.success) {
    throw badRequest();
  }

  try {
    await db.fosterFamily.setIsBanned(fosterFamilyId, formData.data.isBanned);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    throw error;
  }

  return json<ActionData>({});
}

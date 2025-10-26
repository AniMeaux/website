import { db } from "#core/db.server.js";
import { NotFoundError, ReferencedError } from "#core/errors.server.js";
import { Routes } from "#core/navigation.js";
import { badRequest, notFound } from "#core/response.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { catchError } from "@animeaux/core";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { RouteParamsSchema } from "./route-params";

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [UserGroup.ADMIN]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  if (request.method.toUpperCase() !== "DELETE") {
    throw badRequest();
  }

  const [error] = await catchError(() =>
    db.show.standSize.delete(routeParams.id),
  );

  if (error != null) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    if (error instanceof ReferencedError) {
      return json(
        {
          errors: [
            "La taille de stand ne peut être supprimée tant qu’elle est utilisée.",
          ],
        },
        { status: 400 },
      );
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing exhibitor.
  throw redirect(Routes.show.standSizes.toString());
}

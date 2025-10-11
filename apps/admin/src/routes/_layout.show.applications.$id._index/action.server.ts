import { db } from "#core/db.server.js";
import { NotFoundError } from "#core/errors.server.js";
import { Routes } from "#core/navigation.js";
import { badRequest, notFound } from "#core/response.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { catchError } from "@animeaux/core";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { RouteParamsSchema } from "./route-params.js";

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
    db.show.exhibitor.application.delete(routeParams.id),
  );

  if (error != null) {
    if (error instanceof NotFoundError) {
      throw notFound();
    }

    throw error;
  }

  // We are forced to redirect to avoid re-calling the loader with a
  // non-existing exhibitor.
  throw redirect(Routes.show.applications.toString());
}

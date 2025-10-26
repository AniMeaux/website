import { db } from "#core/db.server.js";
import { Routes } from "#core/navigation.js";
import { badRequest, ok } from "#core/response.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ActionIntent, actionSchema } from "./action";
import { routeParamsSchema } from "./route-params";

export async function action({ request, params }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: actionSchema });

  if (
    submission.status !== "success" ||
    request.method.toUpperCase() !== "DELETE"
  ) {
    throw badRequest();
  }

  switch (submission.value.intent) {
    case ActionIntent.deleteExhibitor: {
      await db.show.exhibitor.delete(routeParams.id);

      // We are forced to redirect to avoid re-calling the loader with a
      // non-existing exhibitor.
      throw redirect(Routes.show.exhibitors.toString());
    }

    case ActionIntent.deleteInvoice: {
      await db.show.invoice.delete(submission.value.invoiceId);

      return ok();
    }

    default: {
      return submission.value satisfies never;
    }
  }
}

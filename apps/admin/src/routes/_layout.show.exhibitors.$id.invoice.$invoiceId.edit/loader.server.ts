import { db } from "#core/db.server.js";
import { notFound } from "#core/response.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { routeParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const { invoices, ...exhibitor } = await db.show.exhibitor.findUnique(
    routeParams.id,
    {
      select: {
        name: true,

        invoices: {
          where: { id: routeParams.invoiceId },
          select: {
            amount: true,
            dueDate: true,
            number: true,
            status: true,
            url: true,
          },
        },
      },
    },
  );

  const invoice = invoices[0];

  if (invoice == null) {
    throw notFound();
  }

  return json({ exhibitor, invoice });
}

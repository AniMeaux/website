import { db } from "#core/db.server.js";
import { badRequest, ok } from "#core/response.server.js";
import { assertCurrentUserHasGroups } from "#current-user/groups.server.js";
import { parseWithZod } from "@conform-to/zod";
import { UserGroup } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { actionSchema } from "./action";

export async function action({ request }: ActionFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: actionSchema });

  if (
    submission.status !== "success" ||
    request.method.toUpperCase() !== "DELETE"
  ) {
    throw badRequest();
  }

  await db.show.invoice.delete(submission.value.invoiceId);

  return ok();
}

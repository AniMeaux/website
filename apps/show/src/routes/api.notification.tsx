import { email } from "#core/emails.server";
import { badRequest, unauthorized } from "#core/response.server";
import { createEmailTemplateStatusUpdate } from "#exhibitors/application/emails.server";
import { zu } from "@animeaux/zod-utils";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  assertIsAuthorizedApplication(request);

  const action = zu
    .union([ActionSchemaApplicationStatusUpdated, ActionSchemaTodo])
    .safeParse(await request.json());

  if (!action.success) {
    throw badRequest();
  }

  switch (action.data.type) {
    case ActionSchemaApplicationStatusUpdated.shape.type.value: {
      email.send.template(
        createEmailTemplateStatusUpdate(action.data.applicationId),
      );

      return json({ ok: true });
    }

    case ActionSchemaTodo.shape.type.value: {
      return json({ ok: true });
    }

    default: {
      return action.data satisfies never;
    }
  }
}

const ActionSchemaApplicationStatusUpdated = zu.object({
  type: zu.literal("application-status-updated"),
  applicationId: zu.string().uuid(),
});

const ActionSchemaTodo = zu.object({
  type: zu.literal("todo"),
});

function assertIsAuthorizedApplication(request: Request) {
  const token = request?.headers
    .get("authorization")
    ?.replace(/bearer\s+/i, "");

  if (token !== process.env.APPLICATION_TOKEN_ADMIN) {
    throw unauthorized();
  }
}

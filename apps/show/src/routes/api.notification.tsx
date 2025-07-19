import { email } from "#core/emails.server";
import { badRequest, unauthorized } from "#core/response.server";
import { ApplicationEmails } from "#exhibitors/application/emails.server";
import { DocumentsEmails } from "#exhibitors/documents/email.server";
import { DogsConfigurationEmails } from "#exhibitors/dogs-configuration/email.server.js";
import { ExhibitorEmails } from "#exhibitors/email.server";
import {
  OnStandAnimationsEmails,
  PublicProfileEmails,
} from "#exhibitors/profile/email.server";
import { StandConfigurationEmails } from "#exhibitors/stand-configuration/email.server";
import { zu } from "@animeaux/zod-utils";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  assertIsAuthorizedApplication(request);

  const action = zu
    .union([
      ActionSchemaApplicationStatusUpdated,
      ActionSchemaDocumentsTreated,
      ActionSchemaDogsConfigurationTreated,
      ActionSchemaExhibitorVisibleTreated,
      ActionSchemaOnStandAnimationsTreated,
      ActionSchemaPublicProfileTreated,
      ActionSchemaStandConfigurationTreated,
    ])
    .safeParse(await request.json());

  if (!action.success) {
    throw badRequest();
  }

  switch (action.data.type) {
    case ActionSchemaApplicationStatusUpdated.shape.type.value: {
      email.send.template(ApplicationEmails.treated(action.data.applicationId));

      return json({ ok: true });
    }

    case ActionSchemaDocumentsTreated.shape.type.value: {
      email.send.template(DocumentsEmails.treated(action.data.exhibitorId));

      return json({ ok: true });
    }

    case ActionSchemaDogsConfigurationTreated.shape.type.value: {
      email.send.template(
        DogsConfigurationEmails.treated(action.data.exhibitorId),
      );

      return json({ ok: true });
    }

    case ActionSchemaExhibitorVisibleTreated.shape.type.value: {
      email.send.template(ExhibitorEmails.isVisible(action.data.exhibitorId));

      return json({ ok: true });
    }

    case ActionSchemaOnStandAnimationsTreated.shape.type.value: {
      email.send.template(
        OnStandAnimationsEmails.treated(action.data.exhibitorId),
      );

      return json({ ok: true });
    }

    case ActionSchemaPublicProfileTreated.shape.type.value: {
      email.send.template(PublicProfileEmails.treated(action.data.exhibitorId));

      return json({ ok: true });
    }

    case ActionSchemaStandConfigurationTreated.shape.type.value: {
      email.send.template(
        StandConfigurationEmails.treated(action.data.exhibitorId),
      );

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

const ActionSchemaDocumentsTreated = zu.object({
  type: zu.literal("documents-treated"),
  exhibitorId: zu.string().uuid(),
});

const ActionSchemaDogsConfigurationTreated = zu.object({
  type: zu.literal("dogs-configuration-treated"),
  exhibitorId: zu.string().uuid(),
});

const ActionSchemaExhibitorVisibleTreated = zu.object({
  type: zu.literal("exhibitor-visible"),
  exhibitorId: zu.string().uuid(),
});

const ActionSchemaOnStandAnimationsTreated = zu.object({
  type: zu.literal("on-stand-animations-treated"),
  exhibitorId: zu.string().uuid(),
});

const ActionSchemaPublicProfileTreated = zu.object({
  type: zu.literal("public-profile-treated"),
  exhibitorId: zu.string().uuid(),
});

const ActionSchemaStandConfigurationTreated = zu.object({
  type: zu.literal("stand-configuration-treated"),
  exhibitorId: zu.string().uuid(),
});

function assertIsAuthorizedApplication(request: Request) {
  const token = request?.headers
    .get("authorization")
    ?.replace(/bearer\s+/i, "");

  if (token !== process.env.APPLICATION_TOKEN_ADMIN) {
    throw unauthorized();
  }
}

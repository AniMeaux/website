import { badRequest, unauthorized } from "#core/response.server";
import { services } from "#core/services.server.js";
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
      ActionSchemaDescriptionTreated,
      ActionSchemaStandConfigurationTreated,
    ])
    .safeParse(await request.json());

  if (!action.success) {
    throw badRequest();
  }

  switch (action.data.type) {
    case ActionSchemaApplicationStatusUpdated.shape.type.value: {
      services.applicationEmail.treated(action.data.applicationId);

      return json({ ok: true });
    }

    case ActionSchemaDocumentsTreated.shape.type.value: {
      services.exhibitorEmail.document.treated(action.data.exhibitorId);

      return json({ ok: true });
    }

    case ActionSchemaDogsConfigurationTreated.shape.type.value: {
      services.exhibitorEmail.dogConfiguration.treated(action.data.exhibitorId);

      return json({ ok: true });
    }

    case ActionSchemaExhibitorVisibleTreated.shape.type.value: {
      services.exhibitorEmail.visibility.isVisible(action.data.exhibitorId);

      return json({ ok: true });
    }

    case ActionSchemaOnStandAnimationsTreated.shape.type.value: {
      services.exhibitorEmail.onStandAnimation.treated(action.data.exhibitorId);

      return json({ ok: true });
    }

    case ActionSchemaPublicProfileTreated.shape.type.value: {
      services.exhibitorEmail.publicProfile.treated(action.data.exhibitorId);

      return json({ ok: true });
    }

    case ActionSchemaDescriptionTreated.shape.type.value: {
      services.exhibitorEmail.description.treated(action.data.exhibitorId);

      return json({ ok: true });
    }

    case ActionSchemaStandConfigurationTreated.shape.type.value: {
      services.exhibitorEmail.standConfiguration.treated(
        action.data.exhibitorId,
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

const ActionSchemaDescriptionTreated = zu.object({
  type: zu.literal("description-treated"),
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

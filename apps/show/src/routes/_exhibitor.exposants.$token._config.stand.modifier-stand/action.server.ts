import { Routes } from "#core/navigation";
import { badRequest } from "#core/response.server";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorStatus } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ActionSchema } from "./action-schema";

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: { standConfigurationStatus: true },
  });

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updateStand(routeParams.token, {
    chairCount: submission.value.chairCount,
    dividerCount: submission.value.dividerCount,
    dividerType: submission.value.dividerType,
    hasElectricalConnection: submission.value.hasElectricalConnection,
    hasTablecloths: submission.value.hasTablecloths,
    installationDay: submission.value.installationDay,
    peopleCount: submission.value.peopleCount,
    placementComment: submission.value.placementComment || null,
    size: submission.value.size,
    tableCount: submission.value.tableCount,
    zone: submission.value.zone,
  });

  services.exhibitorEmail.standConfiguration.submitted(routeParams.token);

  throw redirect(Routes.exhibitors.token(routeParams.token).stand.toString());
}

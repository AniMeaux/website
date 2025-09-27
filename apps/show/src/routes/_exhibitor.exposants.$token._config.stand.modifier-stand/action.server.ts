import { Routes } from "#core/navigation";
import { badRequest } from "#core/response.server";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { ShowExhibitorStatus } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { createActionSchema } from "./action-schema";
import { getDividerTypesData } from "./divider-types.server";
import { getStandSizesData } from "./stand-sizes.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      category: true,
      dividerType: { select: { id: true } },
      dividerCount: true,
      standConfigurationStatus: true,
      size: { select: { id: true } },
    },
  });

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw badRequest();
  }

  const {
    standSizesData: { availableStandSizes },
    dividerTypesData: { availableDividerTypes },
  } = await promiseHash({
    standSizesData: getStandSizesData(exhibitor),
    dividerTypesData: getDividerTypesData(exhibitor),
  });

  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: createActionSchema({ availableStandSizes, availableDividerTypes }),
  });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await services.exhibitor.updateStand(routeParams.token, {
    chairCount: submission.value.chairCount,
    dividerCount: submission.value.dividerCount,
    dividerTypeId: submission.value.dividerType?.id ?? null,
    hasElectricalConnection: submission.value.hasElectricalConnection,
    hasTableCloths: submission.value.hasTableCloths,
    installationDay: submission.value.installationDay,
    peopleCount: submission.value.peopleCount,
    placementComment: submission.value.placementComment || null,
    sizeId: submission.value.standSize.id,
    tableCount: submission.value.tableCount,
  });

  services.exhibitorEmail.standConfiguration.submitted(routeParams.token);

  throw redirect(Routes.exhibitors.token(routeParams.token).stand.toString());
}

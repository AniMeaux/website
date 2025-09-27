import { Routes } from "#core/navigation";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { ShowExhibitorStatus } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { getDividerTypesData } from "./divider-types.server";
import { getStandSizesData } from "./stand-sizes.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      name: true,
      activityFields: true,
      category: true,
      chairCount: true,
      dividerCount: true,
      dividerType: { select: { id: true } },
      hasElectricalConnection: true,
      hasTableCloths: true,
      installationDay: true,
      peopleCount: true,
      placementComment: true,
      size: { select: { id: true } },
      standConfigurationStatus: true,
      tableCount: true,
      updatedAt: true,
    },
  });

  if (exhibitor.standConfigurationStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(Routes.exhibitors.token(routeParams.token).stand.toString());
  }

  const { standSizesData, dividerTypesData } = await promiseHash({
    standSizesData: getStandSizesData(exhibitor),
    dividerTypesData: getDividerTypesData(exhibitor),
  });

  return { exhibitor, ...standSizesData, ...dividerTypesData };
}

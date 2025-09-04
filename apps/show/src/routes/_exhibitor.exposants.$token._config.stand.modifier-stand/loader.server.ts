import { Routes } from "#core/navigation";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { ShowExhibitorStatus } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getStandSizesData } from "./stand-sizes.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      name: true,
      activityFields: true,
      chairCount: true,
      dividerCount: true,
      dividerType: true,
      hasElectricalConnection: true,
      hasTablecloths: true,
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

  const standSizesData = await getStandSizesData(exhibitor);

  return { exhibitor, ...standSizesData };
}

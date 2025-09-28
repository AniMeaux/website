import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      token: true,
      dogsConfigurationStatus: true,
      dogsConfigurationStatusMessage: true,
      dogs: {
        select: {
          gender: true,
          idNumber: true,
          isCategorized: true,
          isSterilized: true,
        },
      },
      name: true,
      category: true,
      chairCount: true,
      dividerCount: true,
      dividerType: { select: { label: true } },
      hasCorner: true,
      hasElectricalConnection: true,
      hasTableCloths: true,
      installationDay: true,
      peopleCount: true,
      placementComment: true,
      size: {
        select: {
          label: true,
          priceForAssociations: true,
          priceForServices: true,
          priceForShops: true,
        },
      },
      standConfigurationStatus: true,
      standConfigurationStatusMessage: true,
      tableCount: true,
    },
  });

  return { exhibitor };
}

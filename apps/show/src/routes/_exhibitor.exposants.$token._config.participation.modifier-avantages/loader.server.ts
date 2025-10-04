import { Routes } from "#core/navigation";
import { services } from "#core/services.server.js";
import { RouteParamsSchema } from "#exhibitors/route-params";
import { SectionId } from "#routes/_exhibitor.exposants.$token._config.participation._index/section-id.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { ShowExhibitorStatus } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const exhibitor = await services.exhibitor.getByToken(routeParams.token, {
    select: {
      appetizerPeopleCount: true,
      breakfastPeopleCountSaturday: true,
      breakfastPeopleCountSunday: true,
      category: true,
      hasCorner: true,
      hasTableCloths: true,
      name: true,
      peopleCount: true,
      perksStatus: true,
      size: {
        select: {
          label: true,
          maxPeopleCount: true,
          priceForAssociations: true,
          priceForServices: true,
          priceForShops: true,
        },
      },
      tableCount: true,
    },
  });

  if (exhibitor.perksStatus === ShowExhibitorStatus.VALIDATED) {
    throw redirect(
      Routes.exhibitors
        .token(routeParams.token)
        .participation.toString(SectionId.PERKS),
    );
  }

  return { exhibitor };
}

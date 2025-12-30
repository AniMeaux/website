import { notFound } from "#i/core/response.server.js";
import { services } from "#i/core/services.server.js";
import { RouteParamsSchema } from "#i/exhibitors/route-params";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";

export async function loader({ params }: LoaderFunctionArgs) {
  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const { animations, exhibitor } = await promiseHash({
    animations: services.animation.getManyVisibleByToken(routeParams.token, {
      select: {
        animators: {
          where: { isVisible: true },
          orderBy: { name: "asc" },
          select: { id: true, links: true, name: true },
        },
        description: true,
        endTime: true,
        id: true,
        registrationUrl: true,
        startTime: true,
        targets: true,
        zone: true,
      },
    }),

    exhibitor: services.exhibitor.getByToken(routeParams.token, {
      select: {
        appetizerPeopleCount: true,
        breakfastPeopleCountSaturday: true,
        breakfastPeopleCountSunday: true,
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
        id: true,
        installationDay: true,
        onStandAnimations: true,
        onStandAnimationsStatus: true,
        onStandAnimationsStatusMessage: true,
        peopleCount: true,
        perksStatus: true,
        perksStatusMessage: true,
        placementComment: true,
        size: {
          select: {
            label: true,
            maxPeopleCount: true,
            priceForAssociations: true,
            priceForServices: true,
            priceForShops: true,
          },
        },
        standConfigurationStatus: true,
        standConfigurationStatusMessage: true,
        tableCount: true,
      },
    }),
  });

  return {
    exhibitor,

    animations: animations.map((animation) => ({
      ...animation,

      animators: animation.animators.map(({ links, ...animator }) => {
        const url = links[0];

        if (url == null) {
          throw notFound();
        }

        return { ...animator, url };
      }),
    })),
  };
}

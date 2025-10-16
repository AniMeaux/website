import { notFound } from "#core/response.server.js";
import { services } from "#core/services.server.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import groupBy from "lodash.groupby";
import { routeParamsSchema } from "./route-params.js";

export async function loader({ params }: LoaderFunctionArgs) {
  if (
    process.env.FEATURE_FLAG_SITE_ONLINE !== "true" ||
    process.env.FEATURE_FLAG_SHOW_PROGRAM !== "true"
  ) {
    throw notFound();
  }

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const animations = await services.animation.getManyVisibleByDay(
    routeParams.day,
    {
      select: {
        description: true,
        endTime: true,
        id: true,
        registrationUrl: true,
        startTime: true,
        targets: true,
        zone: true,

        animators: {
          where: { isVisible: true },
          orderBy: { name: "asc" },
          select: {
            id: true,
            isOrganizer: true,
            isOrganizersFavorite: true,
            links: true,
            logoPath: true,
            name: true,

            sponsorship: { select: { isVisible: true } },
          },
        },
      },
    },
  );

  return {
    day: routeParams.day,
    animations: groupBy(
      animations.map((animation) => ({
        ...animation,

        animators: animation.animators.map(({ links, ...animator }) => {
          const url = links[0];

          if (url == null) {
            throw notFound();
          }

          return {
            ...animator,

            url,

            isSponsor:
              process.env.FEATURE_FLAG_SHOW_SPONSORS === "true" &&
              (animator.sponsorship?.isVisible ?? false),
          };
        }),
      })),
      (animation) => animation.zone,
    ),
  };
}

import { notFound } from "#core/response.server";
import { services } from "#core/services.server.js";
import { ExhibitorSearchParams } from "#exhibitors/search-params";
import { ShowExhibitorStatus } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound();
  }

  if (process.env.FEATURE_FLAG_SHOW_EXHIBITORS !== "true") {
    return json({ exhibitors: [] });
  }

  const exhibitors = await services.exhibitor.findManyVisible({
    searchParams: ExhibitorSearchParams.io.parse(
      new URL(request.url).searchParams,
    ),

    select: {
      activityFields: true,
      activityTargets: true,
      id: true,
      isOrganizer: true,
      isOrganizersFavorite: true,
      isRisingStar: true,
      links: true,
      logoPath: true,
      name: true,
      onStandAnimations:
        process.env.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS === "true",
      onStandAnimationsStatus: true,

      sponsorship: { select: { isVisible: true } },

      _count: { select: { animations: { where: { isVisible: true } } } },
    },
  });

  return json({
    exhibitors: exhibitors.map(
      ({
        sponsorship,
        _count,
        links,
        onStandAnimations,
        onStandAnimationsStatus,
        ...exhibitor
      }) => {
        const url = links[0];

        if (url == null) {
          throw notFound();
        }

        return {
          ...exhibitor,
          url,

          isSponsor:
            process.env.FEATURE_FLAG_SHOW_SPONSORS === "true" &&
            (sponsorship?.isVisible ?? false),

          hasOnStageAnimation:
            process.env.FEATURE_FLAG_SHOW_PROGRAM === "true" &&
            _count.animations > 0,

          onStandAnimations:
            process.env.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS === "true" &&
            onStandAnimationsStatus === ShowExhibitorStatus.VALIDATED
              ? onStandAnimations
              : null,
        };
      },
    ),
  });
}

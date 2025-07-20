import { ErrorPage, getErrorTitle } from "#core/data-display/error-page.js";
import { createSocialMeta } from "#core/meta.js";
import { getPageTitle } from "#core/page-title.js";
import { notFound } from "#core/response.server.js";
import { services } from "#core/services/services.server.js";
import { ShowDay } from "#core/show-day";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import groupBy from "lodash.groupby";
import { SectionEventList } from "./section-event-list";
import { SectionOnStandEvents } from "./section-on-stand-events";
import { SectionTitle } from "./section-title";

export async function loader({ params }: LoaderFunctionArgs) {
  if (
    process.env.FEATURE_FLAG_SITE_ONLINE !== "true" ||
    process.env.FEATURE_FLAG_SHOW_PROGRAM !== "true"
  ) {
    throw notFound();
  }

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

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
            links: true,
            name: true,
            logoPath: true,

            partnership: { select: { isVisible: true } },
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
            isOrganizer: animator.id === process.env.ORGANIZER_EXHIBITOR_ID,

            isPartner:
              process.env.FEATURE_FLAG_SHOW_PARTNERS === "true" &&
              (animator.partnership?.isVisible ?? false),
          };
        }),
      })),
      (animation) => animation.zone,
    ),
  };
}

const RouteParamsSchema = zu.object({
  day: zu.nativeEnum(ShowDay.Enum),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data != null ? `Programme du ${data.day}` : getErrorTitle(404),
    ),
  });
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <>
      <SectionTitle />
      <SectionEventList />
      <SectionOnStandEvents />
    </>
  );
}

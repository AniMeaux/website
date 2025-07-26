import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { services } from "#core/services/services.server";
import { ExhibitorSearchParams } from "#exhibitors/search-params";
import { ShowExhibitorStatus } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { SectionList } from "./section-list";
import { SectionTitle } from "./section-title";
import { SectionWaitingHelper } from "./section-waiting-helper";

export async function loader({ request }: LoaderFunctionArgs) {
  if (process.env.FEATURE_FLAG_SITE_ONLINE !== "true") {
    throw notFound();
  }

  if (process.env.FEATURE_FLAG_SHOW_EXHIBITORS !== "true") {
    return json({ exhibitors: [] });
  }

  const exhibitors = await services.exhibitor.findManyVisible({
    searchParams: ExhibitorSearchParams.parse(
      new URL(request.url).searchParams,
    ),

    select: {
      id: true,
      name: true,
      logoPath: true,
      activityFields: true,
      activityTargets: true,
      links: true,
      onStandAnimationsStatus: true,
      onStandAnimations:
        process.env.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS === "true",

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

          isOrganizer: exhibitor.id === process.env.ORGANIZER_EXHIBITOR_ID,

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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createSocialMeta({
    title: getPageTitle(
      data?.exhibitors != null ? "Exposants" : getErrorTitle(404),
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

      {CLIENT_ENV.FEATURE_FLAG_SHOW_EXHIBITORS === "true" ? (
        <SectionList />
      ) : (
        <SectionWaitingHelper />
      )}
    </>
  );
}

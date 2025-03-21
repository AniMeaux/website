import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { createSocialMeta } from "#core/meta";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { services } from "#core/services/services.server";
import { ExhibitorSearchParams } from "#exhibitors/search-params";
import { ShowExhibitorProfileStatus } from "@prisma/client";
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

      profile: {
        select: {
          name: true,
          logoPath: true,
          activityFields: true,
          activityTargets: true,
          links: true,
          onStandAnimationsStatus: true,
          onStandAnimations:
            process.env.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS === "true",
        },
      },

      partnership: { select: { isVisible: true } },

      _count: { select: { animations: { where: { isVisible: true } } } },
    },
  });

  return json({
    exhibitors: exhibitors.map(
      ({ profile, partnership, _count, ...exhibitor }) => {
        if (profile == null) {
          throw notFound();
        }

        const {
          links,
          onStandAnimations,
          onStandAnimationsStatus,
          ...publicProfile
        } = profile;

        const url = links[0];
        if (url == null) {
          throw notFound();
        }

        return {
          ...exhibitor,

          isOrganizer: exhibitor.id === process.env.ORGANIZER_EXHIBITOR_ID,

          isPartner:
            process.env.FEATURE_FLAG_SHOW_PARTNERS === "true" &&
            (partnership?.isVisible ?? false),

          hasOnStageAnimation:
            process.env.FEATURE_FLAG_SHOW_PROGRAM === "true" &&
            _count.animations > 0,

          profile: {
            ...publicProfile,
            url,

            onStandAnimations:
              process.env.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS === "true" &&
              onStandAnimationsStatus === ShowExhibitorProfileStatus.VALIDATED
                ? onStandAnimations
                : null,
          },
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

import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { db } from "#core/db.server";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { safeParseRouteParam, zu } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CardProfile } from "./card-profile";
import { CardSituation } from "./card-situation";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(RouteParamsSchema, params);

  const sponsor = await db.show.sponsor.findUnique(routeParams.id, {
    select: {
      id: true,
      isVisible: true,

      category: true,
      logoPath: true,
      name: true,
      url: true,

      exhibitor: {
        select: {
          id: true,
          logoPath: true,
          name: true,
          links: true,
        },
      },
    },
  });

  if (sponsor.exhibitor == null) {
    invariant(sponsor.logoPath != null, "A logoPath should be defined");
    invariant(sponsor.name != null, "A name should be defined");
    invariant(sponsor.url != null, "A url should be defined");

    return json({
      sponsor: {
        ...sponsor,
        logoPath: sponsor.logoPath,
        name: sponsor.name,
        url: sponsor.url,

        // Add this for a better type completion.
        exhibitorId: null,
      },
    });
  }

  const exhibitorUrl = sponsor.exhibitor.links[0];

  if (exhibitorUrl == null) {
    throw notFound();
  }

  return json({
    sponsor: {
      ...sponsor,
      exhibitorId: sponsor.exhibitor.id,
      logoPath: sponsor.exhibitor.logoPath,
      name: sponsor.exhibitor.name,
      url: exhibitorUrl,
    },
  });
}

const RouteParamsSchema = zu.object({
  id: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: getPageTitle(data?.sponsor.name ?? getErrorTitle(404)) }];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  return (
    <>
      <Header />

      <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
        <div className="grid grid-cols-1 md:col-start-2 md:row-start-1">
          <CardSituation />
        </div>

        <CardProfile />
      </PageLayout.Content>
    </>
  );
}

export function Header() {
  const { sponsor } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Header.Root>
      <PageLayout.Header.Title>{sponsor.name}</PageLayout.Header.Title>
    </PageLayout.Header.Root>
  );
}

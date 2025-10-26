import { SortAndFiltersFloatingAction } from "#core/controllers/sort-and-filters-floating-action";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { notFound } from "#core/response.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { SponsorFilters } from "#show/sponsors/filter-form";
import { SponsorSearchParams } from "#show/sponsors/search-params";
import { UserGroup } from "@animeaux/prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { CardList } from "./card-list";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const searchParams = new URL(request.url).searchParams;

  const { sponsors, totalCount } = await db.show.sponsor.findMany({
    page: PageSearchParams.parse(searchParams).page,
    countPerPage: SPONSOR_COUNT_PER_PAGE,
    searchParams: SponsorSearchParams.parse(searchParams),
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

  const pageCount = Math.ceil(totalCount / SPONSOR_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    sponsors: sponsors.map(({ exhibitor, logoPath, name, url, ...sponsor }) => {
      if (exhibitor == null) {
        invariant(logoPath != null, "A logoPath should be defined");
        invariant(name != null, "A name should be defined");
        invariant(url != null, "A url should be defined");

        return {
          ...sponsor,
          logoPath,
          name,
          url,

          // Add this for a better type completion.
          exhibitorId: null,
        };
      }

      const exhibitorUrl = exhibitor.links[0];

      if (exhibitorUrl == null) {
        throw notFound();
      }

      return {
        ...sponsor,
        exhibitorId: exhibitor.id,
        logoPath: exhibitor.logoPath,
        name: exhibitor.name,
        url: exhibitorUrl,
      };
    }),
  });
}

const SPONSOR_COUNT_PER_PAGE = 20;

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Sponsors") }];
};

export default function Route() {
  const { totalCount } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Content className="grid grid-cols-1">
      <section className="flex flex-col gap-1 md:flex-row md:gap-2">
        <section className="flex flex-col md:min-w-0 md:flex-2">
          <CardList />
        </section>

        <aside className="hidden min-w-[250px] max-w-[300px] flex-1 flex-col md:flex">
          <Card className="sticky top-[calc(20px+var(--header-height))] max-h-[calc(100vh-40px-var(--header-height))]">
            <Card.Header>
              <Card.Title>Filtrer</Card.Title>
            </Card.Header>

            <Card.Content hasVerticalScroll>
              <SponsorFilters />
            </Card.Content>
          </Card>
        </aside>
      </section>

      <SortAndFiltersFloatingAction totalCount={totalCount}>
        <SponsorFilters />
      </SortAndFiltersFloatingAction>
    </PageLayout.Content>
  );
}

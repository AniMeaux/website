import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { Empty } from "#core/data-display/empty";
import { db } from "#core/db.server";
import { Card } from "#core/layout/card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { getPageTitle } from "#core/page-title";
import { prisma } from "#core/prisma.server";
import { PageSearchParams } from "#core/search-params";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { StatusBadge } from "#show/applications/status";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { promiseHash } from "remix-utils/promise";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const searchParams = new URL(request.url).searchParams;
  const pageSearchParams = PageSearchParams.parse(searchParams);

  const { applications, totalCount } = await promiseHash({
    totalCount: prisma.showExhibitorApplication.count(),

    applications: prisma.showExhibitorApplication.findMany({
      skip: pageSearchParams.page * APPLICATION_COUNT_PER_PAGE,
      take: APPLICATION_COUNT_PER_PAGE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        structureLogoPath: true,
        structureName: true,
      },
    }),
  });

  const pageCount = Math.ceil(totalCount / APPLICATION_COUNT_PER_PAGE);

  return json({
    totalCount,
    pageCount,
    applications,
  });
}

const APPLICATION_COUNT_PER_PAGE = 20;

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Candidatures") }];
};

export default function Route() {
  const { totalCount, pageCount, applications } =
    useLoaderData<typeof loader>();

  return (
    <PageLayout.Content className="grid grid-cols-1">
      <Card>
        <Card.Header>
          <Card.Title>
            {totalCount} {totalCount > 1 ? "candidatures" : "candidature"}
          </Card.Title>
        </Card.Header>

        <Card.Content hasListItems>
          {applications.length > 0 ? (
            <ul className="grid grid-cols-1">
              {applications.map((application) => (
                <li key={application.id} className="grid grid-cols-1">
                  <ApplicationItem application={application} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              isCompact
              icon="📝"
              iconAlt="Memo"
              title="Aucune candidature trouvée"
              message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
              titleElementType="h3"
            />
          )}
        </Card.Content>

        {pageCount > 1 ? (
          <Card.Footer>
            <Paginator pageCount={pageCount} />
          </Card.Footer>
        ) : null}
      </Card>
    </PageLayout.Content>
  );
}

function ApplicationItem({
  application,
}: {
  application: SerializeFrom<typeof loader>["applications"][number];
}) {
  return (
    <BaseLink
      to={Routes.show.applications.id(application.id).toString()}
      className="grid grid-cols-2 items-start gap-1 rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:gap-2 md:px-1"
    >
      <span className="text-body-emphasis">{application.structureName}</span>
      <span>
        <StatusBadge status={application.status} />
      </span>
    </BaseLink>
  );
}

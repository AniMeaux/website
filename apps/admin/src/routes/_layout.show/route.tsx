import { db } from "#i/core/db.server";
import type { RouteHandle } from "#i/core/handles.js";
import { PageLayout } from "#i/core/layout/page";
import { Routes } from "#i/core/navigation";
import { assertCurrentUserHasGroups } from "#i/current-user/groups.server";
import { Entity } from "#i/routes/resources.global-search/entity.js";
import { hasGroups } from "#i/users/groups.js";
import { UserGroup } from "@animeaux/prisma";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

export const handle: RouteHandle = {
  globalSearchEntity: Entity.Enum.EXHIBITOR,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  return json({ currentUser });
}

export default function Route() {
  const { currentUser } = useLoaderData<typeof loader>();

  const isAdmin = hasGroups(currentUser, [UserGroup.ADMIN]);

  return (
    <PageLayout.Root>
      <PageLayout.Tabs>
        <PageLayout.Tab isNavLink to={Routes.show.applications.toString()}>
          Candidatures
        </PageLayout.Tab>

        <PageLayout.Tab isNavLink to={Routes.show.exhibitors.toString()}>
          Exposants
        </PageLayout.Tab>

        <PageLayout.Tab isNavLink to={Routes.show.sponsors.toString()}>
          Sponsors
        </PageLayout.Tab>

        {isAdmin ? (
          <>
            <PageLayout.Tab isNavLink to={Routes.show.standSizes.toString()}>
              Tailles de stand
            </PageLayout.Tab>

            <PageLayout.Tab isNavLink to={Routes.show.dividerTypes.toString()}>
              Cloisons
            </PageLayout.Tab>
          </>
        ) : null}
      </PageLayout.Tabs>

      <Outlet />
    </PageLayout.Root>
  );
}

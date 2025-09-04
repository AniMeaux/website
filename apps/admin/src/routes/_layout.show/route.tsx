import { db } from "#core/db.server";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { ok } from "#core/response.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  return ok();
}

export default function Route() {
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

        <PageLayout.Tab isNavLink to={Routes.show.standSizes.toString()}>
          Tailles de stand
        </PageLayout.Tab>
      </PageLayout.Tabs>

      <Outlet />
    </PageLayout.Root>
  );
}

import { db } from "#core/db.server.ts";
import { PageLayout } from "#core/layout/page.tsx";
import { Routes } from "#core/navigation.ts";
import { hasGroups } from "#users/groups.tsx";
import { UserGroup } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  const hasDashboard = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return json({ hasDashboard });
}

export default function Route() {
  const { hasDashboard } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  return (
    <PageLayout>
      {hasDashboard ? (
        <PageLayout.Tabs>
          <PageLayout.Tab isNavLink to={Routes.animals.dashboard.toString()}>
            Tableau de bord
          </PageLayout.Tab>

          <PageLayout.Tab
            to={Routes.animals.search.toString()}
            // Don't use `isNavLink` because we want "/animals/$id" to be under
            // "/animals/search"
            aria-current={
              pathname !== Routes.animals.dashboard.toString()
                ? "page"
                : undefined
            }
          >
            Tous les animaux
          </PageLayout.Tab>
        </PageLayout.Tabs>
      ) : null}

      <Outlet />
    </PageLayout>
  );
}

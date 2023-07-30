import { UserGroup } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { db } from "~/core/db.server";
import { PageLayout } from "~/core/layout/page";
import { hasGroups } from "~/users/groups";

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
          <PageLayout.Tab isNavLink to="/animals/dashboard">
            Tableau de bord
          </PageLayout.Tab>

          <PageLayout.Tab
            to="/animals/search"
            aria-current={
              pathname !== "/animals/dashboard" ? "page" : undefined
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

import { UserGroup } from "@prisma/client";
import { json, LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { PageLayout, PageTab, PageTabs } from "~/core/layout/page";
import { getCurrentUser } from "~/currentUser/db.server";
import { hasGroups } from "~/users/groups";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  const hasDashboard = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  return json({ hasDashboard });
}

export default function AnimalsPage() {
  const { hasDashboard } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  return (
    <PageLayout>
      {hasDashboard ? (
        <PageTabs>
          <PageTab isNavLink to="/animals/dashboard">
            Tableau de bord
          </PageTab>

          <PageTab
            to="/animals/search"
            aria-current={
              pathname !== "/animals/dashboard" ? "page" : undefined
            }
          >
            Tous les animaux
          </PageTab>
        </PageTabs>
      ) : null}

      <Outlet />
    </PageLayout>
  );
}

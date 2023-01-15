import { Outlet, useLocation } from "@remix-run/react";
import { PageLayout, PageTab, PageTabs } from "~/core/layout/page";

export default function AnimalsPage() {
  const { pathname } = useLocation();

  return (
    <PageLayout>
      <PageTabs>
        <PageTab isNavLink to="/animals/dashboard">
          Tableau de bord
        </PageTab>

        <PageTab
          to="/animals/search"
          aria-current={pathname !== "/animals/dashboard" ? "page" : undefined}
        >
          Tous les animaux
        </PageTab>
      </PageTabs>

      <Outlet />
    </PageLayout>
  );
}

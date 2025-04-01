import { Header } from "#core/layout/header";
import { Routes } from "#core/navigation";
import { ShowDay } from "#core/show-day";
import { useLocation } from "@remix-run/react";

export function LayoutHeader() {
  const location = useLocation();

  if (CLIENT_ENV.FEATURE_FLAG_SITE_ONLINE !== "true") {
    if (location.pathname === Routes.home.toString()) {
      return null;
    }

    return <Header.Root />;
  }

  return (
    <Header.Root>
      {!ShowDay.hasShowEnded() ? (
        <Header.NavItem to={CLIENT_ENV.TICKETING_URL}>
          Billetterie
        </Header.NavItem>
      ) : null}

      <Header.NavItem to={Routes.exhibitors.toString()}>
        Exposants
      </Header.NavItem>

      <Header.NavItem to={Routes.program.toString()}>Programme</Header.NavItem>

      <Header.NavItem to={Routes.access.toString()}>Accès</Header.NavItem>

      <Header.NavItem to={Routes.faq.toString()}>FAQ</Header.NavItem>
    </Header.Root>
  );
}

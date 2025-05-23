import { Header } from "#core/layout/header";
import { Routes } from "#core/navigation";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function LayoutHeader() {
  const { profile, token } = useLoaderData<typeof loader>();

  const routes = Routes.exhibitors.token(token);

  return (
    <Header.Root>
      <Header.NavItem to={routes.toString()} exclude={routes.faq.toString()}>
        {profile.name}
      </Header.NavItem>

      <Header.NavItem to={routes.faq.toString()}>
        FAQ et Documents
      </Header.NavItem>
    </Header.Root>
  );
}

import { PageLayout } from "#i/core/layout/page.js";
import { getPageTitle } from "#i/core/page-title.js";
import type { MetaFunction } from "@remix-run/react";
import { CardList } from "./card-list";

export { loader } from "./loader.server";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Tailles de stand") }];
};

export default function Route() {
  return (
    <PageLayout.Content className="grid grid-cols-1 md:min-w-0">
      <CardList />
    </PageLayout.Content>
  );
}

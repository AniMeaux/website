import { PageLayout } from "#core/layout/page.js";
import { getPageTitle } from "#core/page-title.js";
import type { MetaFunction } from "@remix-run/react";
import { CardList } from "./card-list";

export { loader } from "./loader.server";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Cloisons") }];
};

export default function Route() {
  return (
    <PageLayout.Content className="grid grid-cols-1 md:min-w-0">
      <CardList />
    </PageLayout.Content>
  );
}

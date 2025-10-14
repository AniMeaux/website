import { ErrorPage } from "#core/data-display/error-page";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { CardForm } from "./card-form.js";

export { action } from "./action.server.js";
export { loader } from "./loader.server.js";

export const meta: MetaFunction = () => {
  return [{ title: getPageTitle("Nouvelle famille d’accueil") }];
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col items-center">
        <CardForm />
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

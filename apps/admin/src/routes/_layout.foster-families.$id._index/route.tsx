import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { BlockHelper } from "#core/data-display/helper";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { action } from "./action.server";
import { CardActions } from "./card-actions";
import { CardComments } from "./card-comments";
import { CardContact } from "./card-contact";
import { CardFosterAnimals } from "./card-foster-animals";
import { CardHeader } from "./card-header";
import { CardSituation } from "./card-situation";
import { loader } from "./loader.server";

export { action, loader };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const fosterFamily = data?.fosterFamily;
  if (fosterFamily == null) {
    return [{ title: getPageTitle(getErrorTitle(404)) }];
  }

  return [{ title: getPageTitle(fosterFamily.displayName) }];
};

export function ErrorBoundary() {
  return <ErrorPage />;
}

export default function Route() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <PageLayout.Root>
      <PageLayout.Content className="flex flex-col gap-1 md:gap-2">
        {fosterFamily.isBanned ? (
          <BlockHelper variant="warning" icon="icon-ban-solid">
            {fosterFamily.displayName} est actuellement banni.
          </BlockHelper>
        ) : null}

        <CardHeader />

        <section className="grid grid-cols-1 gap-1 md:hidden">
          <CardContact />
          <CardSituation />
          <CardComments />
          <CardFosterAnimals />
          <CardActions />
        </section>

        <section className="hidden md:grid md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
          <section className="md:flex md:flex-col md:gap-2">
            <CardContact />
            <CardFosterAnimals />
          </section>

          <section className="md:flex md:flex-col md:gap-2">
            <CardSituation />
            <CardComments />
            <CardActions />
          </section>
        </section>
      </PageLayout.Content>
    </PageLayout.Root>
  );
}

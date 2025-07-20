import { ErrorPage, getErrorTitle } from "#core/data-display/error-page";
import { PageLayout } from "#core/layout/page";
import { getPageTitle } from "#core/page-title";
import { zu } from "@animeaux/zod-utils";
import type { MetaFunction } from "@remix-run/react";
import { CardActivityDescription } from "./card-activity-description";
import { CardComments } from "./card-comments";
import { CardContact } from "./card-contact";
import { CardDiscoverySource } from "./card-discovery-source";
import { CardMotivation } from "./card-motivation";
import { CardParticipation } from "./card-participation";
import { CardPartnership } from "./card-partnership";
import { CardSituation } from "./card-situation";
import { CardSituationRefusalMessage } from "./card-situation-refusal-message";
import { CardStructure } from "./card-structure";
import type { loader } from "./loader.server";

export { loader } from "./loader.server";

export const RouteParamsSchema = zu.object({
  applicationId: zu.string().uuid(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: getPageTitle(
        data?.application.structureName != null
          ? `Candidature de ${data.application.structureName}`
          : getErrorTitle(404),
      ),
    },
  ];
};

export function ErrorBoundary() {
  return (
    <PageLayout.Content className="grid grid-cols-1">
      <ErrorPage />
    </PageLayout.Content>
  );
}

export default function Route() {
  return (
    <PageLayout.Content className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0px,2fr)_minmax(250px,1fr)] md:items-start md:gap-2">
      <div className="grid grid-cols-1 gap-1 md:col-start-2 md:row-start-1 md:gap-2">
        <CardSituation />
        <CardSituationRefusalMessage />
        <CardContact />
      </div>

      <div className="grid grid-cols-1 gap-1 md:gap-2">
        <CardStructure />
        <CardActivityDescription />
        <CardParticipation />
        <CardComments />

        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <CardPartnership />
          <CardDiscoverySource />
        </div>

        <CardMotivation />
      </div>
    </PageLayout.Content>
  );
}

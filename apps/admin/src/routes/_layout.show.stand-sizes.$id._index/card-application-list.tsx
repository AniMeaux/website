import { Action } from "#i/core/actions.js";
import { BaseLink } from "#i/core/base-link.js";
import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation.js";
import {
  ApplicationSearchParams,
  ApplicationSearchParamsN,
} from "#i/show/exhibitors/applications/search-params.js";
import { useLoaderData } from "@remix-run/react";
import { ApplicationItem } from "./application-item";
import type { loader } from "./loader.server";

export function CardApplicationList() {
  const { standSize, applicationTotalCount, applications } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {applicationTotalCount}{" "}
          {applicationTotalCount > 1 ? "candidatures" : "candidature"}
        </Card.Title>

        {applicationTotalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.show.applications.toString(),
                search: ApplicationSearchParams.format({
                  sort: ApplicationSearchParamsN.Sort.CREATED_AT,
                  standSizesId: new Set([standSize.id]),
                }),
              }}
            >
              Tout voir
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {applications.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2">
            {applications.map((application) => (
              <ApplicationItem key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="📝"
            iconAlt="Memo"
            title="Aucune candidature"
            titleElementType="h3"
            message="Pour l’instant ;)"
          />
        )}
      </Card.Content>
    </Card>
  );
}

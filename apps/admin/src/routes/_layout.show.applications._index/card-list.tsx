import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { Paginator } from "#i/core/controllers/paginator";
import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";
import { DownloadApplicationsTrigger } from "#i/routes/downloads.show.applications/trigger.js";
import { ApplicationSearchParams } from "#i/show/exhibitors/applications/search-params";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { useLoaderData } from "@remix-run/react";
import { ApplicationItem } from "./item";
import type { loader } from "./route";

export function CardList() {
  const { totalCount, pageCount, applications, canExport } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {totalCount} {totalCount > 1 ? "candidatures" : "candidature"}
        </Card.Title>

        {canExport ? (
          <DownloadApplicationsTrigger asChild>
            <Action variant="text" color="gray">
              <Action.Icon href="icon-download-solid" />
              Exporter
            </Action>
          </DownloadApplicationsTrigger>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {applications.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 @lg/card-content:grid-cols-[auto_auto_1fr_auto] @3xl/card-content:grid-cols-[auto_auto_auto_1fr_auto_auto] md:gap-x-2">
            {applications.map((application) => (
              <ApplicationItem key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="📝"
            iconAlt="Memo"
            title="Aucune candidature trouvée"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
            action={
              !ApplicationSearchParams.isEmpty(searchParams) ? (
                <Action asChild>
                  <BaseLink to={{ search: "" }}>Effacer les filtres</BaseLink>
                </Action>
              ) : null
            }
          />
        )}
      </Card.Content>

      {pageCount > 1 ? (
        <Card.Footer>
          <Paginator pageCount={pageCount} />
        </Card.Footer>
      ) : null}
    </Card>
  );
}

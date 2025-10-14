import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { DownloadExhibitorsTrigger } from "#routes/downloads.show.exhibitors/trigger.js";
import { ExhibitorSearchParams } from "#show/exhibitors/search-params";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { useLoaderData } from "@remix-run/react";
import { ExhibitorItem } from "./item";
import type { loader } from "./loader.server";

export function CardList() {
  const { totalCount, pageCount, exhibitors, canExport } =
    useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {totalCount} {totalCount > 1 ? "exposants" : "exposant"}
        </Card.Title>

        {canExport ? (
          <DownloadExhibitorsTrigger asChild>
            <Action variant="text" color="gray">
              <Action.Icon href="icon-download-solid" />
              Exporter
            </Action>
          </DownloadExhibitorsTrigger>
        ) : null}
      </Card.Header>

      <Card.Content hasListItems>
        {exhibitors.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2">
            {exhibitors.map((exhibitor) => (
              <ExhibitorItem key={exhibitor.id} exhibitor={exhibitor} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="🛍️"
            iconAlt="Sacs de course"
            title="Aucun exposant trouvé"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
            action={
              !ExhibitorSearchParams.isEmpty(searchParams) ? (
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

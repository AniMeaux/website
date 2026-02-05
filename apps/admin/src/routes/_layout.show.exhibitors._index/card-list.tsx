import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { Paginator } from "#i/core/controllers/paginator";
import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";
import { DownloadExhibitorsTrigger } from "#i/routes/downloads.show.exhibitors/trigger.js";
import { ExhibitorSearchParams } from "#i/show/exhibitors/search-params";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";
import { Row, Rows } from "./rows";

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
          <Rows>
            {exhibitors.map((exhibitor) => (
              <Row key={exhibitor.id} exhibitor={exhibitor} />
            ))}
          </Rows>
        ) : (
          <SimpleEmpty
            isCompact
            icon="🛍️"
            iconAlt="Sacs de course"
            title="Aucun exposant trouvé"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
            action={
              !ExhibitorSearchParams.io.isEmpty(searchParams) ? (
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

import { Action } from "#i/core/actions.js";
import { BaseLink } from "#i/core/base-link.js";
import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation.js";
import { ExhibitorSearchParams } from "#i/show/exhibitors/search-params.js";
import { useLoaderData } from "@remix-run/react";
import { ExhibitorItem } from "./exhibitor-item";
import type { loader } from "./loader.server";

export function CardExhibitorList() {
  const { standSize, exhibitorTotalCount, exhibitors } =
    useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {exhibitorTotalCount}{" "}
          {exhibitorTotalCount > 1 ? "exposants" : "exposant"}
        </Card.Title>

        {exhibitorTotalCount > 0 ? (
          <Action asChild variant="text">
            <BaseLink
              to={{
                pathname: Routes.show.exhibitors.toString(),
                search: ExhibitorSearchParams.io.format({
                  sort: ExhibitorSearchParams.Sort.Enum.NAME,
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
            title="Aucun exposant"
            message="Pour l’instant ;)"
            titleElementType="h3"
          />
        )}
      </Card.Content>
    </Card>
  );
}

import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation.js";
import {
  ExhibitorSearchParams,
  ExhibitorSearchParamsN,
} from "#show/exhibitors/search-params.js";
import { useLoaderData } from "@remix-run/react";
import { ExhibitorItem } from "./exhibitor-item";
import type { loader } from "./loader.server";

export function CardExhibitorList() {
  const { dividerType, exhibitors, exhibitorTotalCount } =
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
                search: ExhibitorSearchParams.format({
                  sort: ExhibitorSearchParamsN.Sort.DIVIDER_COUNT,
                  dividerTypesId: new Set([dividerType.id]),
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
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 @md:grid-cols-[auto_auto_1fr_auto] md:gap-x-2">
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

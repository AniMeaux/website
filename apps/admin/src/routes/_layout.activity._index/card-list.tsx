import { ActivitySearchParams } from "#activity/search-params.js";
import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { Paginator } from "#core/controllers/paginator";
import { SimpleEmpty } from "#core/data-display/empty.js";
import { Card } from "#core/layout/card";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { useLoaderData } from "@remix-run/react";
import { ActivityItem } from "./item";
import type { loader } from "./loader.server";

export function CardList() {
  const { totalCount, pageCount, activities } = useLoaderData<typeof loader>();

  const [searchParams] = useOptimisticSearchParams();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {totalCount} {totalCount > 1 ? "activités" : "activité"}
        </Card.Title>
      </Card.Header>

      <Card.Content hasListItems>
        {activities.length > 0 ? (
          <div className="grid grid-cols-[auto_auto_auto_minmax(max-content,1fr)] gap-x-1 md:gap-x-2">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="🍃"
            iconAlt="Feuilles"
            title="Aucune activité trouvée"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
            action={
              !ActivitySearchParams.io.isEmpty(searchParams) ? (
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

import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Paginator } from "#core/controllers/paginator";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { PartnerSearchParams } from "#show/partners/search-params";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import { useLoaderData } from "@remix-run/react";
import { PartnerItem } from "./item";
import type { loader } from "./route";

export function CardList() {
  const { totalCount, pageCount, partners } = useLoaderData<typeof loader>();
  const [searchParams] = useOptimisticSearchParams();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {totalCount} {totalCount > 1 ? "partenaires" : "partenaire"}
        </Card.Title>
      </Card.Header>

      <Card.Content hasListItems>
        {partners.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 @lg/card-content:grid-cols-[auto_auto_1fr_auto] md:gap-x-2">
            {partners.map((partner) => (
              <PartnerItem key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="🏅"
            iconAlt="Médaille"
            title="Aucun partenaire trouvé"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
            action={
              !PartnerSearchParams.isEmpty(searchParams) ? (
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

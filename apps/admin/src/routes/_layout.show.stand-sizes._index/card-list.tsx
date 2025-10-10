import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation.js";
import { useLoaderData } from "@remix-run/react";
import { StandSizeItem } from "./item";
import type { loader } from "./loader.server";

export function CardList() {
  const { standSizes } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {standSizes.length}{" "}
          {standSizes.length > 1 ? "tailles de stand" : "taille de stand"}
        </Card.Title>

        <Action asChild variant="text">
          <BaseLink to={Routes.show.standSizes.new.toString()}>Créer</BaseLink>
        </Action>
      </Card.Header>

      <Card.Content hasListItems>
        {standSizes.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2">
            {standSizes.map((standSize) => (
              <StandSizeItem key={standSize.id} standSize={standSize} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="📐"
            iconAlt="Équerre"
            title="Aucune taille de stand trouvée"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
          />
        )}
      </Card.Content>
    </Card>
  );
}

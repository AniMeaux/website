import { SimpleEmpty } from "#core/data-display/empty";
import { Card } from "#core/layout/card";
import { useLoaderData } from "@remix-run/react";
import { ExhibitorItem } from "./exhibitor-item";
import type { loader } from "./loader.server";

export function CardExhibitorList() {
  const { dividerType } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {dividerType.exhibitors.length}{" "}
          {dividerType.exhibitors.length > 1 ? "exposants" : "exposant"}
        </Card.Title>
      </Card.Header>

      <Card.Content hasListItems>
        {dividerType.exhibitors.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 @md:grid-cols-[auto_auto_1fr_auto] md:gap-x-2">
            {dividerType.exhibitors.map((exhibitor) => (
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

import { useLoaderData } from "@remix-run/react";

import { SimpleEmpty } from "#i/core/data-display/empty";
import { Card } from "#i/core/layout/card";

import { DividerTypeItem } from "./item";
import type { loader } from "./loader.server";

export function CardList() {
  const { dividerTypes } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {dividerTypes.length}{" "}
          {dividerTypes.length > 1 ? "types de cloison" : "type de cloison"}
        </Card.Title>
      </Card.Header>

      <Card.Content hasListItems>
        {dividerTypes.length > 0 ? (
          <div className="grid grid-cols-[auto_1fr_auto] gap-x-1 md:gap-x-2">
            {dividerTypes.map((dividerType) => (
              <DividerTypeItem key={dividerType.id} dividerType={dividerType} />
            ))}
          </div>
        ) : (
          <SimpleEmpty
            isCompact
            icon="🚧"
            iconAlt="Panneau de construction"
            title="Aucun type de cloison trouvé"
            message="Nous n’avons pas trouvé ce que vous cherchiez. Essayez à nouveau de rechercher."
            titleElementType="h3"
          />
        )}
      </Card.Content>
    </Card>
  );
}

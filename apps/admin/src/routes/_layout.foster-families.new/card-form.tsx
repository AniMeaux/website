import { Card } from "#i/core/layout/card";
import { useBackIfPossible } from "#i/core/navigation";
import { FosterFamilyForm } from "#i/foster-families/form";
import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server.js";

export function CardForm() {
  const fetcher = useFetcher<typeof action>();

  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <Card className="w-full md:max-w-[600px]">
      <Card.Header>
        <Card.Title>Nouvelle famille d’accueil</Card.Title>
      </Card.Header>

      <Card.Content>
        <FosterFamilyForm fetcher={fetcher} />
      </Card.Content>
    </Card>
  );
}

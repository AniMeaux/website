import { Card } from "#core/layout/card";
import { useBackIfPossible } from "#core/navigation";
import { FosterFamilyForm } from "#foster-families/form";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { action } from "./action.server.js";
import type { loader } from "./loader.server.js";

export function CardForm() {
  const { fosterFamily } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useBackIfPossible({ fallbackRedirectTo: fetcher.data?.redirectTo });

  return (
    <Card className="w-full md:max-w-[600px]">
      <Card.Header>
        <Card.Title>Modifier {fosterFamily.displayName}</Card.Title>
      </Card.Header>

      <Card.Content>
        <FosterFamilyForm
          defaultFosterFamily={fosterFamily}
          fetcher={fetcher}
        />
      </Card.Content>
    </Card>
  );
}

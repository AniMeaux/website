import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardActivityDescription() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Présentation de l’activité</Card.Title>
      </Card.Header>

      <Card.Content>
        <div>
          <Markdown components={ARTICLE_COMPONENTS}>
            {application.structureActivityDescription}
          </Markdown>
        </div>
      </Card.Content>
    </Card>
  );
}

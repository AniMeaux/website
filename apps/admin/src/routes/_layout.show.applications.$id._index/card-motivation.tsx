import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown";
import { Card } from "#i/core/layout/card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardMotivation() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Motivation</Card.Title>
      </Card.Header>

      <Card.Content>
        <div>
          <Markdown components={ARTICLE_COMPONENTS}>
            {application.motivation}
          </Markdown>
        </div>
      </Card.Content>
    </Card>
  );
}

import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardComments() {
  const { application } = useLoaderData<typeof loader>();

  if (application.comments == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Commentaires</Card.Title>
      </Card.Header>

      <Card.Content>
        <div>
          <Markdown components={ARTICLE_COMPONENTS}>
            {application.comments}
          </Markdown>
        </div>
      </Card.Content>
    </Card>
  );
}

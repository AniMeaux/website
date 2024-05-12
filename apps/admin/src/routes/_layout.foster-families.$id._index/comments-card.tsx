import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CommentsCard() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  if (fosterFamily.comments == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Commentaires privés</Card.Title>
      </Card.Header>

      <Card.Content>
        <Markdown components={ARTICLE_COMPONENTS}>
          {fosterFamily.comments}
        </Markdown>
      </Card.Content>
    </Card>
  );
}

import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { ActionFormData } from "#foster-families/form";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardComments() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  if (fosterFamily.comments == null) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Commentaires privés</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={{
              pathname: Routes.fosterFamilies
                .id(fosterFamily.id)
                .edit.toString(),
              hash: ActionFormData.keys.comments,
            }}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <Markdown components={ARTICLE_COMPONENTS}>
          {fosterFamily.comments}
        </Markdown>
      </Card.Content>
    </Card>
  );
}

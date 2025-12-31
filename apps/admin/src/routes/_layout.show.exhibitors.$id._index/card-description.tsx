import { Action } from "#i/core/actions.js";
import { BaseLink } from "#i/core/base-link.js";
import { Empty } from "#i/core/data-display/empty";
import { ARTICLE_COMPONENTS, Markdown } from "#i/core/data-display/markdown";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation.js";
import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { StatusHelper } from "#i/show/exhibitors/status-helper";
import { ExhibitorStatusIcon } from "#i/show/exhibitors/status-icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardDescription() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Description</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.description.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <DescriptionStatusHelper />

        {exhibitor.description != null ? (
          <div>
            <Markdown components={ARTICLE_COMPONENTS}>
              {exhibitor.description}
            </Markdown>
          </div>
        ) : (
          <Empty.Root>
            <Empty.Content>
              <Empty.Message>Aucune description</Empty.Message>
            </Empty.Content>
          </Empty.Root>
        )}
      </Card.Content>
    </Card>
  );
}

function DescriptionStatusHelper() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ExhibitorStatusIcon status={exhibitor.descriptionStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.descriptionStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.descriptionStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.descriptionStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

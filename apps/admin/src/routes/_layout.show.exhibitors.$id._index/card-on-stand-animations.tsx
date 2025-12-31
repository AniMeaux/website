import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { Empty } from "#i/core/data-display/empty";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  SENTENCE_COMPONENTS,
} from "#i/core/data-display/markdown";
import { Card } from "#i/core/layout/card";
import { Routes } from "#i/core/navigation";
import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { StatusHelper } from "#i/show/exhibitors/status-helper";
import { ExhibitorStatusIcon } from "#i/show/exhibitors/status-icon.js";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardOnStandAnimations() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Animations sur stand</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.onStandAnimations.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <OnStandAnimationsStatusHelper />

        {exhibitor.onStandAnimations != null ? (
          <div>
            <Markdown components={SENTENCE_COMPONENTS}>
              {exhibitor.onStandAnimations}
            </Markdown>
          </div>
        ) : (
          <Empty.Root>
            <Empty.Content>
              <Empty.Message>Aucune animation sur stand prévue</Empty.Message>
            </Empty.Content>
          </Empty.Root>
        )}
      </Card.Content>
    </Card>
  );
}

function OnStandAnimationsStatusHelper() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ExhibitorStatusIcon status={exhibitor.onStandAnimationsStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.onStandAnimationsStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.onStandAnimationsStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.onStandAnimationsStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

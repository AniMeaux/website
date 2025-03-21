import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Empty } from "#core/data-display/empty";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  SENTENCE_COMPONENTS,
} from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import {
  ProfileStatus,
  ProfileStatusIcon,
} from "#show/exhibitors/profile/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardOnStandAnimations() {
  const { profile, exhibitor } = useLoaderData<typeof loader>();

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

        {profile.onStandAnimations != null ? (
          <div>
            <Markdown components={SENTENCE_COMPONENTS}>
              {profile.onStandAnimations}
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
  const { profile } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ProfileStatusIcon status={profile.onStandAnimationsStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ProfileStatus.translation[profile.onStandAnimationsStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {profile.onStandAnimationsStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {profile.onStandAnimationsStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

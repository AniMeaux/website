import { Empty } from "#core/data-display/empty";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import {
  ProfileStatus,
  ProfileStatusIcon,
} from "#show/exhibitors/profile/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardDescription() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Description</Card.Title>
      </Card.Header>

      <Card.Content>
        <DescriptionStatusHelper />

        {profile.description != null ? (
          <div>
            <Markdown components={ARTICLE_COMPONENTS}>
              {profile.description}
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
  const { profile } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <ProfileStatusIcon status={profile.descriptionStatus} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ProfileStatus.translation[profile.descriptionStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {profile.descriptionStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {profile.descriptionStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

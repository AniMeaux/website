import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { AvatarCard } from "#core/layout/avatar-card";
import { Routes } from "#core/navigation";
import {
  AVATAR_COLOR_BY_AVAILABILITY,
  FosterFamilyAvatar,
} from "#foster-families/avatar";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardHeader() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <AvatarCard>
      <AvatarCard.BackgroundColor
        color={AVATAR_COLOR_BY_AVAILABILITY[fosterFamily.availability]}
      />

      <AvatarCard.Content>
        <AvatarCard.Avatar>
          <FosterFamilyAvatar
            size="lg"
            availability={fosterFamily.availability}
          />
        </AvatarCard.Avatar>

        <AvatarCard.Lines>
          <AvatarCard.FirstLine>
            <h1>{fosterFamily.displayName}</h1>
          </AvatarCard.FirstLine>
        </AvatarCard.Lines>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </AvatarCard.Content>
    </AvatarCard>
  );
}

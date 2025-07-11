import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { AvatarCard } from "#core/layout/avatar-card";
import { PageLayout } from "#core/layout/page";
import { Routes } from "#core/navigation";
import { AvailabilityChip } from "#foster-families/availability-chip";
import {
  AVATAR_COLOR_BY_AVAILABILITY,
  FosterFamilyAvatar,
} from "#foster-families/avatar";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardHeader() {
  const { fosterFamily } = useLoaderData<typeof loader>();

  return (
    <>
      <PageLayout.Header.Root className="grid grid-cols-fr-auto items-center gap-2 md:gap-4">
        <div className="grid grid-cols-1 justify-items-start gap-1 md:gap-2">
          <PageLayout.Header.Title>
            {fosterFamily.displayName}
          </PageLayout.Header.Title>

          <AvailabilityChip
            availability={fosterFamily.availability}
            expirationDate={fosterFamily.availabilityExpirationDate}
          />
        </div>

        <Action variant="primary" isIconOnly className="md:hidden" asChild>
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            <Action.Icon href="icon-pen-solid" />
          </BaseLink>
        </Action>

        <Action variant="primary" className="hidden md:flex" asChild>
          <BaseLink
            to={Routes.fosterFamilies.id(fosterFamily.id).edit.toString()}
          >
            <Action.Icon href="icon-pen-solid" />
            Modifier
          </BaseLink>
        </Action>
      </PageLayout.Header.Root>

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
    </>
  );
}

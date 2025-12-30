import type { AvatarColor } from "#i/core/data-display/avatar";
import { Avatar } from "#i/core/data-display/avatar";
import { Icon } from "#i/generated/icon";
import { FosterFamilyAvailability } from "@animeaux/prisma";
import type { Except } from "type-fest";

export function FosterFamilyAvatar({
  availability,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Avatar>, "color"> & {
  availability: FosterFamilyAvailability;
}) {
  return (
    <Avatar {...props} color={AVATAR_COLOR_BY_AVAILABILITY[availability]}>
      <Icon href="icon-house-solid" />
    </Avatar>
  );
}

export const AVATAR_COLOR_BY_AVAILABILITY: Record<
  FosterFamilyAvailability,
  AvatarColor
> = {
  [FosterFamilyAvailability.AVAILABLE]: "green-light",
  [FosterFamilyAvailability.UNAVAILABLE]: "red-light",
  [FosterFamilyAvailability.UNKNOWN]: "gray-light",
};

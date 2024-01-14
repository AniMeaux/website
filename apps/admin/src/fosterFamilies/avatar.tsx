import type { AvatarColor } from "#core/dataDisplay/avatar.tsx";
import { Avatar } from "#core/dataDisplay/avatar.tsx";
import { Icon } from "#generated/icon";
import { FosterFamilyAvailability } from "@prisma/client";
import type { Except } from "type-fest";

export function FosterFamilyAvatar({
  availability,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Avatar>, "color"> & {
  availability: FosterFamilyAvailability;
}) {
  return (
    <Avatar {...props} color={AVATAR_COLOR_BY_AVAILABILITY[availability]}>
      <Icon id="house" />
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

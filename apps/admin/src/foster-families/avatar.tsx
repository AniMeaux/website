import type { AvatarColor } from "#core/data-display/avatar";
import { Avatar } from "#core/data-display/avatar";
import { FosterFamilyAvailability } from "#foster-families/availability";
import { Icon } from "#generated/icon";
import type { Except } from "type-fest";

export function FosterFamilyAvatar({
  availability,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Avatar>, "color"> & {
  availability: FosterFamilyAvailability.Enum;
}) {
  return (
    <Avatar {...props} color={AVATAR_COLOR_BY_AVAILABILITY[availability]}>
      <Icon href="icon-house-solid" />
    </Avatar>
  );
}

export const AVATAR_COLOR_BY_AVAILABILITY: Record<
  FosterFamilyAvailability.Enum,
  AvatarColor
> = {
  [FosterFamilyAvailability.Enum.AVAILABLE]: "green-light",
  [FosterFamilyAvailability.Enum.UNAVAILABLE]: "red-light",
  [FosterFamilyAvailability.Enum.UNKNOWN]: "gray-light",
};

import {
  Avatar,
  AvatarProps,
  inferAvatarColor,
} from "#/core/dataDisplay/avatar";
import { FosterFamily } from "@prisma/client";

export function FosterFamilyAvatar({
  fosterFamily,
  ...props
}: Omit<AvatarProps, "color" | "icon" | "letter"> & {
  fosterFamily: Pick<FosterFamily, "id">;
}) {
  return (
    <Avatar {...props} color={inferAvatarColor(fosterFamily.id)} icon="house" />
  );
}

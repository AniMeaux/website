import { FosterFamily } from "@prisma/client";
import {
  Avatar,
  AvatarProps,
  inferAvatarColor,
} from "~/core/dataDisplay/avatar";

export function FosterFamilyAvatar({
  fosterFamily,
  ...props
}: Omit<AvatarProps, "color" | "icon" | "letter"> & {
  fosterFamily: Pick<FosterFamily, "id">;
}) {
  return (
    <Avatar
      {...props}
      color={inferAvatarColor(fosterFamily.id)}
      icon="houseChimneyPaw"
    />
  );
}

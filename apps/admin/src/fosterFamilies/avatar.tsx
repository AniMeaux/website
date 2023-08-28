import type { AvatarProps } from "#core/dataDisplay/avatar.tsx";
import { Avatar } from "#core/dataDisplay/avatar.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import type { FosterFamily } from "@prisma/client";

export function FosterFamilyAvatar({
  fosterFamily,
  ...props
}: Omit<AvatarProps, "color" | "icon" | "letter"> & {
  fosterFamily: Pick<FosterFamily, "id">;
}) {
  return (
    <Avatar
      {...props}
      color={inferInstanceColor(fosterFamily.id)}
      icon="house"
    />
  );
}

import { FosterFamily } from "@prisma/client";
import { Avatar, AvatarProps } from "~/core/dataDisplay/avatar";
import { inferInstanceColor } from "~/core/dataDisplay/instanceColor";

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

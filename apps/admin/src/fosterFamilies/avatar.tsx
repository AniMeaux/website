import { Avatar } from "#core/dataDisplay/avatar.tsx";
import { inferInstanceColor } from "#core/dataDisplay/instanceColor.tsx";
import { Icon } from "#generated/icon";
import type { FosterFamily } from "@prisma/client";
import type { Except } from "type-fest";

export function FosterFamilyAvatar({
  fosterFamily,
  ...props
}: Except<React.ComponentPropsWithoutRef<typeof Avatar>, "color"> & {
  fosterFamily: Pick<FosterFamily, "id">;
}) {
  return (
    <Avatar {...props} color={inferInstanceColor(fosterFamily.id)}>
      <Icon id="house" />
    </Avatar>
  );
}

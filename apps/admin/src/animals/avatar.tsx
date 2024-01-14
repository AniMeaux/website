import type { AvatarSize } from "#core/dataDisplay/avatar.tsx";
import { Avatar } from "#core/dataDisplay/avatar.tsx";
import type { DynamicImageProps } from "#core/dataDisplay/image.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import type { Animal } from "@prisma/client";
import type { Except } from "type-fest";

export function AnimalAvatar({
  animal,
  size = "sm",
  ...props
}: Except<
  DynamicImageProps,
  "imageId" | "alt" | "fallbackSize" | "sizeMapping" | "aspectRatio"
> & {
  animal: Pick<Animal, "avatar" | "name">;
  size?: AvatarSize;
}) {
  return (
    <Avatar asChild size={size}>
      <DynamicImage
        {...props}
        imageId={animal.avatar}
        alt={animal.name}
        fallbackSize="256"
        sizeMapping={{ default: SIZE_VALUE[size] }}
        aspectRatio="1:1"
      />
    </Avatar>
  );
}

const SIZE_VALUE: Record<AvatarSize, string> = {
  sm: "20px",
  lg: "40px",
  xl: "80px",
};

import type { AvatarSize } from "#core/dataDisplay/avatar.tsx";
import { AVATAR_SIZE_CLASS_NAME } from "#core/dataDisplay/avatar.tsx";
import type { DynamicImageProps } from "#core/dataDisplay/image.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { cn } from "@animeaux/core";
import type { Animal } from "@prisma/client";
import type { Except } from "type-fest";

export function AnimalAvatar({
  animal,
  size = "sm",
  className,
  ...rest
}: Except<
  DynamicImageProps,
  "imageId" | "alt" | "fallbackSize" | "sizeMapping" | "aspectRatio"
> & {
  animal: Pick<Animal, "avatar" | "name">;
  size?: AvatarSize;
}) {
  return (
    <DynamicImage
      {...rest}
      imageId={animal.avatar}
      alt={animal.name}
      fallbackSize="256"
      sizeMapping={{ default: SIZE_VALUE[size] }}
      aspectRatio="1:1"
      className={cn(className, AVATAR_SIZE_CLASS_NAME[size])}
    />
  );
}

const SIZE_VALUE: Record<AvatarSize, string> = {
  sm: "20px",
  lg: "40px",
  xl: "80px",
};

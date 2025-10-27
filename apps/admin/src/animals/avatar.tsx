import type { AvatarSize } from "#core/data-display/avatar";
import { Avatar } from "#core/data-display/avatar";
import type { DynamicImageProps } from "#core/data-display/image";
import { DynamicImage } from "#core/data-display/image";
import type { Animal } from "@animeaux/prisma/client";
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
  md: "40px",
  lg: "80px",
};

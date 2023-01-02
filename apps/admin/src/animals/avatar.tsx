import { Animal } from "@prisma/client";
import { cn } from "~/core/classNames";
import { AvatarSize, AVATAR_SIZE_CLASS_NAME } from "~/core/dataDisplay/avatar";
import { DynamicImage, DynamicImageProps } from "~/core/dataDisplay/image";

export function AnimalAvatar({
  animal,
  size = "sm",
  className,
  ...rest
}: Omit<
  DynamicImageProps,
  "imageId" | "alt" | "fallbackSize" | "sizes" | "aspectRatio"
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
      sizes={{ default: SIZE_VALUE[size] }}
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

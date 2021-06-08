import { ImageFileOrId, isImageFile } from "@animeaux/shared-entities";
import cn from "classnames";
import { Transformation } from "cloudinary-core";
import { cloudinaryInstance } from "core/cloudinary";
import { Sentry } from "core/sentry";
import { StyleProps } from "core/types";
import { useState } from "react";
import { FaImage } from "react-icons/fa";

type ImagePreset = "avatar" | "none";

const ImagePresetTransformOptions: Record<
  ImagePreset,
  (devicePixelRatio: number) => Transformation.Options | undefined
> = {
  none: () => undefined,
  avatar: (devicePixelRatio) => {
    const size = Math.round(48 * devicePixelRatio);
    return { crop: "fill", width: size, height: size };
  },
};

export type ImageProps = StyleProps & {
  image: ImageFileOrId;
  alt: string;
  preset?: ImagePreset;
};

export function Image({
  image,
  preset = "none",
  alt,
  className,
  ...rest
}: ImageProps) {
  const src = isImageFile(image)
    ? image.dataUrl
    : cloudinaryInstance.url(
        image,
        ImagePresetTransformOptions[preset](window.devicePixelRatio)
      );

  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <span {...rest} title={alt} className={cn("Image--error", className)}>
        <FaImage />
      </span>
    );
  }

  return (
    <img
      {...rest}
      className={className}
      src={src}
      alt={alt}
      onError={(error) => {
        Sentry.captureException(error, { extra: { image, src } });
        setHasError(true);
      }}
    />
  );
}

export function AvatarImage({
  preset = "avatar",
  className,
  ...rest
}: ImageProps) {
  return (
    <Image {...rest} preset={preset} className={cn("AvatarImage", className)} />
  );
}

import { StyleProps } from "@animeaux/ui-library/build/core/types";
import cn from "classnames";
import * as React from "react";

export type ImageProps = StyleProps & {
  smallImage: string;
  largeImage: string;
  alt: string;
};

export function Image({
  alt,
  smallImage,
  largeImage,
  className,
  ...rest
}: ImageProps) {
  return (
    <picture>
      <img
        {...rest}
        src={smallImage}
        srcSet={[smallImage, `${largeImage} 2x`].join(", ")}
        alt={alt}
        className={cn("Image", className)}
      />
    </picture>
  );
}

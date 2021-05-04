import cn from "classnames";
import * as React from "react";
import { StyleProps } from "../../core/types";

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
    <img
      {...rest}
      src={smallImage}
      srcSet={[smallImage, `${largeImage} 2x`].join(", ")}
      alt={alt}
      className={cn("Image", className)}
    />
  );
}

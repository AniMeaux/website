import cn from "classnames";
import { useState } from "react";
import { useAsyncMemo } from "react-behave";
import { FaImage } from "react-icons/fa";
import { getConfig } from "~/core/config";
import { captureException } from "~/core/sentry";
import { StyleProps } from "~/core/types";
import styles from "./image.module.css";

type GetImageUrlSize = {
  width: number;
  height: number;
};

export function getImageUrl(image: string, size?: GetImageUrlSize) {
  if (size != null) {
    return `https://res.cloudinary.com/${
      getConfig().cloudinaryCloudName
    }/image/upload/c_fill,w_${size.width},h_${size.height}/${image}.jpg`;
  }

  return `https://res.cloudinary.com/${
    getConfig().cloudinaryCloudName
  }/image/upload/${image}.jpg`;
}

type CommonProps = StyleProps & {
  alt: string;
};

type BaseImageProps = CommonProps & {
  src?: string;
  srcSet?: string;
};

function BaseImage({ alt, className, src, srcSet, ...rest }: BaseImageProps) {
  const [hasError, setHasError] = useState(false);

  if ((src == null && srcSet == null) || hasError) {
    return (
      <span
        {...rest}
        title={alt}
        className={cn(styles.image, styles.error, className)}
      >
        <FaImage />
      </span>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      srcSet={srcSet}
      alt={alt}
      className={cn(styles.image, className)}
      onError={(error) => {
        captureException(error, {
          extra: { src, srcSet, alt },
        });

        setHasError(true);
      }}
    />
  );
}

export type StaticImageProps = CommonProps & {
  smallImage: string;
  largeImage: string;
};

export function StaticImage({
  smallImage,
  largeImage,
  ...rest
}: StaticImageProps) {
  return (
    <BaseImage
      {...rest}
      src={smallImage}
      srcSet={`${smallImage}, ${largeImage} 2x`}
    />
  );
}

export type CloudinaryImageProps = CommonProps & {
  imageId?: string;
  size?: GetImageUrlSize;
};

export function CloudinaryImage({
  imageId,
  size,
  ...rest
}: CloudinaryImageProps) {
  return (
    <BaseImage
      {...rest}
      src={imageId == null ? undefined : getImageUrl(imageId, size)}
    />
  );
}

class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  withAlpha(a: number) {
    return new Color(this.r, this.g, this.b, a);
  }

  toRgba(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}

async function getImageDominantColor(src: string): Promise<Color | null> {
  return new Promise((resolve) => {
    const image = new Image();

    // To avoid `SecurityError` being thrown for cross origin images.
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const canvasContext = canvas.getContext("2d");

      if (canvasContext == null) {
        resolve(null);
        return;
      }

      canvasContext.drawImage(image, 0, 0, 1, 1);

      try {
        const imageData = canvasContext.getImageData(0, 0, 1, 1);
        resolve(
          new Color(
            imageData.data[0],
            imageData.data[1],
            imageData.data[2],
            imageData.data[3]
          )
        );
      } catch (error) {
        console.error("getImageDominantColor:", error);
        captureException(error, {
          extra: { call: "getImageDominantColor", src },
        });

        resolve(null);
      }
    };

    image.onerror = (error) => {
      console.error("getImageDominantColor:", error);
      captureException(error, {
        extra: { call: "getImageDominantColor", src },
      });

      resolve(null);
    };

    image.src = src;
  });
}

export type UseImageDominantColorParams =
  | { imageId: string }
  | { src: string }
  | null;

export function useImageDominantColor(params?: UseImageDominantColorParams) {
  let resolvedSrc =
    params == null
      ? null
      : "imageId" in params
      ? getImageUrl(params.imageId, { width: 10, height: 10 })
      : params.src;

  return useAsyncMemo(
    async () =>
      resolvedSrc == null ? null : getImageDominantColor(resolvedSrc),
    [resolvedSrc]
  );
}

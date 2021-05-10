import * as Sentry from "@sentry/react";
import cn from "classnames";
import { Cloudinary } from "cloudinary-core";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import { StyleProps } from "~/core/types";
import styles from "./image.module.css";

const cloudinary = new Cloudinary({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  secure: true,
});

type CommonProps = StyleProps & {
  alt: string;
};

type BaseImageProps = CommonProps & {
  src: string;
  srcSet?: string;
};

function BaseImage({ alt, className, src, srcSet, ...rest }: BaseImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
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
        Sentry.captureException(error, {
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
  imageId: string;
};

export function CloudinaryImage({ imageId, ...rest }: CloudinaryImageProps) {
  return <BaseImage {...rest} src={cloudinary.url(imageId)} />;
}

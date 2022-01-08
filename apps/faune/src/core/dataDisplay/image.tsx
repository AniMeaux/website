import { Sentry } from "core/sentry";
import { StyleProps } from "core/types";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import styled from "styled-components";
import { theme } from "styles/theme";

export type ImageFile = {
  id: string;
  file: File;
  dataUrl: string;
};

export type ImageFileOrId = string | ImageFile;

export function isImageFile(image: ImageFileOrId): image is ImageFile {
  return typeof image !== "string";
}

export function getImageId(image: ImageFileOrId) {
  return isImageFile(image) ? image.id : image;
}

type ImagePreset = "avatar" | "none";

const ImagePresetTransformOptions: Record<
  ImagePreset,
  (devicePixelRatio: number) => string
> = {
  none: () => "",
  avatar: (devicePixelRatio) => {
    const size = Math.round(48 * devicePixelRatio);
    return `c_fill,h_${size},w_${size}/`;
  },
};

// https://res.cloudinary.com/do3tcc2ku/image/upload/c_fill,h_96,w_96/8eb85a85-90f5-498f-a0ee-051cf66b22a7

// https://res.cloudinary.com/do3tcc2ku/image/upload/8eb85a85-90f5-498f-a0ee-051cf66b22a7

type ImageProps = StyleProps & {
  image: ImageFileOrId;
  alt: string;
  preset?: ImagePreset;
};

export function Image({ image, preset = "none", alt, ...rest }: ImageProps) {
  const src = isImageFile(image)
    ? image.dataUrl
    : `https://res.cloudinary.com/${
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      }/image/upload/${ImagePresetTransformOptions[preset](
        window.devicePixelRatio
      )}f_auto/${image}`;

  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Error {...rest} title={alt}>
        <FaImage />
      </Error>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      onError={(error) => {
        Sentry.captureException(error, { extra: { image, src } });
        setHasError(true);
      }}
    />
  );
}

const Error = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
`;

export const AvatarImage = styled(Image).attrs({ preset: "avatar" })`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

import { ImageFileOrId, isImageFile } from "@animeaux/shared-entities";
import { Transformation } from "cloudinary-core";
import { cloudinaryInstance } from "core/cloudinary";
import { Sentry } from "core/sentry";
import { StyleProps } from "core/types";
import { useState } from "react";
import { FaImage } from "react-icons/fa";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

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

type ImageProps = StyleProps & {
  image: ImageFileOrId;
  alt: string;
  preset?: ImagePreset;
};

export function Image({ image, preset = "none", alt, ...rest }: ImageProps) {
  const src = isImageFile(image)
    ? image.dataUrl
    : cloudinaryInstance.url(
        image,
        ImagePresetTransformOptions[preset](window.devicePixelRatio)
      );

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

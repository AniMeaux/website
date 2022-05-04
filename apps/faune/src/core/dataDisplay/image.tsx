import { useState } from "react";
import { FaImage } from "react-icons/fa";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { getConfig } from "~/core/config";
import { Sentry } from "~/core/sentry";
import { StyleProps } from "~/core/types";
import { theme } from "~/styles/theme";

// 10 MiB = 10 * 1024 * 1024 B
export const IMAGE_SIZE_LIMIT = 10485760;

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
  image?: ImageFileOrId | null;
  alt: string;
  preset?: ImagePreset;
};

export function Image({ image, preset = "none", alt, ...rest }: ImageProps) {
  const src =
    image == null
      ? null
      : isImageFile(image)
      ? image.dataUrl
      : `https://res.cloudinary.com/${
          getConfig().cloudinaryCloudName
        }/image/upload/${ImagePresetTransformOptions[preset](
          window.devicePixelRatio
        )}${image}.jpg`;

  const [hasError, setHasError] = useState(false);

  if (src == null || hasError) {
    return (
      <Error {...rest} title={alt} data-fallback>
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

export async function getFiles(fileList: FileList): Promise<ImageFile[]> {
  const files: Promise<ImageFile>[] = [];

  for (let index = 0; index < fileList.length; index++) {
    files.push(readFile(fileList[index]));
  }

  return await Promise.all(files);
}

async function readFile(file: File): Promise<ImageFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      return resolve({
        id: uuid(),
        file,
        dataUrl: loadEvent.target!.result as string,
      });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

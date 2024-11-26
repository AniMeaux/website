import { CLOUDINARY_IMAGE_SIZE_LIMIT_MB } from "#core/cloudinary";
import { useConfig } from "#core/config";
import { generateId } from "#core/id";
import type { ScreenSize } from "#generated/theme";
import { theme } from "#generated/theme";
import type { ImageData } from "@animeaux/core";
import { cn } from "@animeaux/core";
import { blurhashToDataUri } from "@unpic/placeholder";
import orderBy from "lodash.orderby";
import { forwardRef } from "react";
import type { Except, Merge } from "type-fest";

export const IMAGE_SIZE_LIMIT_MB = CLOUDINARY_IMAGE_SIZE_LIMIT_MB;
export const IMAGE_SIZE_LIMIT_B =
  IMAGE_SIZE_LIMIT_MB *
  // 1024 * 1024 B
  1048576;

export function isImageOverSize(image: ImageFileOrData) {
  return isImageFile(image) && image.file.size > IMAGE_SIZE_LIMIT_B;
}

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;
export type ImageSize = (typeof IMAGE_SIZES)[number];

// Larger to smaller.
const SCREEN_SIZES = orderBy(
  (Object.entries(theme.screens) as [ScreenSize | "default", string][]).map(
    ([name, width]) =>
      [name, Number(width.replace("px", ""))] as [
        ScreenSize | "default",
        number,
      ],
  ),
  ([_, width]) => width,
  "desc",
)
  .map(([name]) => name)
  .concat("default");

type AspectRatio = "none" | "1:1" | "4:3";

const ASPECT_RATIO_CLASS_NAME: Record<AspectRatio, undefined | string> = {
  "1:1": cn("aspect-square"),
  "4:3": cn("aspect-4/3"),
  none: undefined,
};

const ASPECT_RATIO_BLURHASH_SIZE: Record<
  AspectRatio,
  { width: number; height: number }
> = {
  "1:1": { width: 16, height: 16 },
  "4:3": { width: 16, height: 12 },
  none: { width: 16, height: 16 },
};

type ImageBackground = "none" | "gray";

const IMAGE_BACKGROUND_CLASS_NAME: Record<ImageBackground, string> = {
  gray: "bg-gray-100",
  none: "",
};

type ObjectFit = "cover" | "contain";

const OBJECT_FIT_CLASS_NAME: Record<ObjectFit, string> = {
  contain: cn("object-contain"),
  cover: cn("object-cover"),
};

export type DynamicImageProps = React.ComponentPropsWithoutRef<
  typeof BaseImage
> & {
  fallbackSize: ImageSize;
  image: ImageData;
  sizeMapping: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
};

export function DynamicImage({
  image,
  sizeMapping,
  aspectRatio = "4:3",
  fallbackSize,
  background,
  objectFit = "contain",
  className,
  style: styleProp = {},
  ...props
}: DynamicImageProps) {
  const config = useConfig();

  const srcSet = IMAGE_SIZES.map((size) => {
    const url = createCloudinaryUrl(config.cloudinaryName, image.id, {
      size,
      aspectRatio,
      objectFit,
    });

    return `${url} ${size}w`;
  }).join(",");

  const sizes = SCREEN_SIZES.reduce<string[]>((sizes, screen) => {
    const width = sizeMapping[screen];

    if (width != null) {
      sizes.push(
        screen === "default"
          ? width
          : `(min-width: ${theme.screens[screen]}) ${width}`,
      );
    }

    return sizes;
  }, []).join(",");

  const style = styleProp;

  if (image.blurhash != null) {
    const blurhashSize = ASPECT_RATIO_BLURHASH_SIZE[aspectRatio];

    style.backgroundImage = `url(${blurhashToDataUri(image.blurhash, blurhashSize.width, blurhashSize.width)})`;
  }

  return (
    <BaseImage
      {...props}
      aspectRatio={aspectRatio}
      src={createCloudinaryUrl(config.cloudinaryName, image.id, {
        size: fallbackSize,
        aspectRatio,
        objectFit,
      })}
      srcSet={srcSet}
      sizes={sizes}
      background={image.blurhash != null ? "none" : background}
      className={cn(image.blurhash != null ? "bg-cover" : undefined, className)}
      style={style}
    />
  );
}

export function createCloudinaryUrl(
  cloudName: string,
  imageId: string,
  {
    aspectRatio = "none",
    objectFit = "contain",
    format = "auto",
    size,
  }: {
    aspectRatio?: AspectRatio;
    objectFit?: ObjectFit;
    format?: "auto" | "jpg";
    size?: ImageSize;
  } = {},
) {
  const transformations = [
    // https://cloudinary.com/documentation/image_optimization#automatic_quality_selection_q_auto
    "q_auto",
    // When using devtools to emulate different browsers, Cloudinary may return a
    // format that is unsupported by the main browser, so images may not display
    // as expected. For example, if using Chrome dev tools to emulate an iPhone
    // Safari browser, a JPEG-2000 may be returned, which Chrome does not support.
    // See: https://cloudinary.com/documentation/image_optimization#tips_and_considerations_for_using_f_auto
    // https://cloudinary.com/documentation/image_transformations#f_auto
    format === "auto" ? "f_auto" : "f_jpg",
  ];

  if (size != null) {
    transformations.push(`w_${size}`);
  }

  if (aspectRatio !== "none") {
    transformations.push(
      // https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
      `ar_${aspectRatio}`,
    );

    if (objectFit === "cover") {
      // https://cloudinary.com/documentation/transformation_reference#c_fit
      transformations.push("c_fill");
    }
    // A size is required for c_pad.
    else if (size != null) {
      transformations.push(
        // https://cloudinary.com/documentation/transformation_reference#c_pad
        "c_pad",
        // https://cloudinary.com/documentation/transformation_reference#b_auto
        "b_auto",
      );
    }
  }

  const transformationsStr = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsStr}/${imageId}`;
}

export type ImageFile = {
  dataUrl: string;
  file: File;
  id: string;
};

export type ImageFileOrData = ImageData | ImageFile;

export function isImageFile(image: ImageFileOrData): image is ImageFile {
  return "dataUrl" in image;
}

export function DataUrlOrDynamicImage({
  fallbackSize,
  image,
  sizeMapping: sizes,
  ...rest
}: Except<React.ComponentPropsWithoutRef<typeof DataUrlImage>, "imageFile"> &
  Except<DynamicImageProps, "image"> & {
    image: ImageFileOrData;
  }) {
  if (isImageFile(image)) {
    return <DataUrlImage {...rest} imageFile={image} />;
  }

  return (
    <DynamicImage
      {...rest}
      image={image}
      fallbackSize={fallbackSize}
      sizeMapping={sizes}
    />
  );
}

function DataUrlImage({
  imageFile,
  ...rest
}: React.ComponentPropsWithoutRef<typeof BaseImage> & {
  imageFile: ImageFile;
}) {
  return <BaseImage {...rest} src={imageFile.dataUrl} />;
}

export async function readFiles(fileList: FileList): Promise<ImageFile[]> {
  const files: Promise<ImageFile>[] = [];
  for (const file of fileList) {
    files.push(readFile(file));
  }

  return await Promise.all(files);
}

export async function readFile(file: File): Promise<ImageFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target!.result as string;
      const id = generateId();
      return resolve({ dataUrl, file, id });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const BaseImage = forwardRef<
  React.ComponentRef<"img">,
  Merge<
    React.ComponentPropsWithoutRef<"img">,
    {
      aspectRatio?: AspectRatio;
      background?: ImageBackground;
      objectFit?: ObjectFit;

      // Make it required.
      alt: string;
    }
  >
>(function BaseImage(
  {
    aspectRatio = "4:3",
    objectFit = "contain",
    background = "gray",
    alt,
    loading = "lazy",
    className,
    ...rest
  },
  ref,
) {
  return (
    <img
      {...rest}
      ref={ref}
      alt={alt}
      loading={loading}
      className={cn(
        ASPECT_RATIO_CLASS_NAME[aspectRatio],
        IMAGE_BACKGROUND_CLASS_NAME[background],
        OBJECT_FIT_CLASS_NAME[objectFit],
        className,
      )}
    />
  );
});

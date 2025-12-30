import type { ImageData } from "#i/core/image/data.js";
import type { ScreenSize } from "#i/generated/theme";
import { theme } from "#i/generated/theme";
import { cn } from "@animeaux/core";
import { blurhashToDataUri } from "@unpic/placeholder";
import orderBy from "lodash.orderby";
import { forwardRef } from "react";

export const DynamicImage = forwardRef<
  React.ComponentRef<"img">,
  Omit<React.ComponentPropsWithoutRef<"img">, "alt" | "sizes"> & {
    alt: string;
    aspectRatio?: AspectRatio;
    fallbackSize: ImageSize;
    fillTransparentBackground?: boolean;
    image: ImageData;
    objectFit?: ObjectFit;
    sizes: Partial<Record<ScreenSize, string>> & {
      // `default` is mandatory.
      default: string;
    };
  }
>(function DynamicImage(
  {
    image,
    alt,
    sizes: sizesProp,
    aspectRatio = "1:1",
    objectFit = "contain",
    fallbackSize,
    fillTransparentBackground = false,
    loading = "lazy",
    className,
    style: styleProp = {},
    ...props
  },
  ref,
) {
  const srcSet = IMAGE_SIZES.map((size) => {
    const url = createImageUrl(CLIENT_ENV.CLOUDINARY_CLOUD_NAME, image.id, {
      size,
      aspectRatio,
      objectFit,
      fillTransparentBackground,
    });

    return `${url} ${size}w`;
  }).join(",");

  const sizes = SCREEN_SIZES.reduce<string[]>((sizes, screen) => {
    const width = sizesProp[screen];

    if (width != null) {
      sizes.push(
        screen === "default" ? width : createImageMedia(screen, width),
      );
    }

    return sizes;
  }, []).join(",");

  const style = styleProp;

  if (image.blurhash != null) {
    const blurhashSize = ASPECT_RATIO_BLURHASH_SIZE[aspectRatio];

    style.backgroundImage = `url(${blurhashToDataUri(image.blurhash, blurhashSize.width, blurhashSize.height)})`;
  }

  return (
    <img
      {...props}
      ref={ref}
      alt={alt}
      loading={loading}
      src={createImageUrl(CLIENT_ENV.CLOUDINARY_CLOUD_NAME, image.id, {
        size: fallbackSize,
        aspectRatio,
        objectFit,
        fillTransparentBackground,
      })}
      srcSet={srcSet}
      sizes={sizes}
      className={cn(
        image.blurhash != null ? "bg-cover" : undefined,
        ASPECT_RATIO_CLASS_NAME[aspectRatio],
        OBJECT_FIT_CLASS_NAME[objectFit],
        className,
      )}
      style={style}
    />
  );
});

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;
type ImageSize = (typeof IMAGE_SIZES)[number];

type AspectRatio = "none" | "1:1" | "4:3" | "16:9" | "16:10";
type ObjectFit = "cover" | "contain";

export function createImageMedia(screenSize: ScreenSize, width?: string) {
  return [`(min-width: ${theme.screens[screenSize]})`, width]
    .filter(Boolean)
    .join(" ");
}

export function createImageUrl(
  cloudName: string,
  imageId: string,
  {
    aspectRatio = "none",
    fillTransparentBackground = false,
    objectFit = "contain",
    format = "auto",
    size,
  }: {
    aspectRatio?: AspectRatio;
    fillTransparentBackground?: boolean;
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
      // Use c_pad instead of c_fit to ensure remaining space is filled with a
      // background.
      // https://cloudinary.com/documentation/transformation_reference#c_fill
      // https://cloudinary.com/documentation/transformation_reference#c_pad
      objectFit === "contain" ? "c_pad" : "c_fill",
    );
  }

  // Ensure transparent images have a background that hides the blurhash.
  if (fillTransparentBackground) {
    // https://cloudinary.com/documentation/transformation_reference#b_background
    transformations.push("b_white");
  }

  const transformationsStr = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsStr}/${imageId}`;
}

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

const ASPECT_RATIO_CLASS_NAME: Record<AspectRatio, string> = {
  "1:1": cn("aspect-square"),
  "4:3": cn("aspect-4/3"),
  "16:9": cn("aspect-video"),
  "16:10": cn("aspect-16/10"),
  none: "",
};

const ASPECT_RATIO_BLURHASH_SIZE: Record<
  AspectRatio,
  { width: number; height: number }
> = {
  "1:1": { width: 16, height: 16 },
  "4:3": { width: 16, height: 12 },
  "16:9": { width: 16, height: 9 },
  "16:10": { width: 16, height: 10 },
  none: { width: 16, height: 16 },
};

const OBJECT_FIT_CLASS_NAME: Record<ObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
};

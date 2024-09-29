import { useConfig } from "#core/config";
import type { ScreenSize } from "#generated/theme";
import { theme } from "#generated/theme";
import type { ImageData } from "@animeaux/core";
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
    loading = "lazy",
    className,
    style: styleProp = {},
    ...props
  },
  ref,
) {
  const config = useConfig();

  const srcSet = IMAGE_SIZES.map((size) => {
    const url = createImageUrl(config.cloudinaryName, image.id, {
      size,
      aspectRatio,
      objectFit,
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
    style.backgroundImage = `url(${blurhashToDataUri(image.blurhash, 16, 16)})`;
  }

  return (
    <img
      {...props}
      ref={ref}
      alt={alt}
      loading={loading}
      src={createImageUrl(config.cloudinaryName, image.id, {
        size: fallbackSize,
        aspectRatio,
        objectFit,
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
    objectFit = "contain",
    format = "auto",
    size,
  }: {
    aspectRatio?: AspectRatio;
    objectFit?: ObjectFit;
    format?: "auto" | "jpg";
    size?: ImageSize;
  },
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
      // https://cloudinary.com/documentation/transformation_reference#c_fill
      // https://cloudinary.com/documentation/transformation_reference#c_fit
      objectFit === "contain" ? "c_fit" : "c_fill",
    );
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

const OBJECT_FIT_CLASS_NAME: Record<ObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
};

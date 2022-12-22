import { cn } from "#/core/classNames";
import { useConfig } from "#/core/config";
import { ScreenSize, theme } from "#/generated/theme";
import orderBy from "lodash.orderby";

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;
type ImageSize = typeof IMAGE_SIZES[number];

// Larger to smaller.
const SCREEN_SIZES = orderBy(
  (Object.entries(theme.screens) as [ScreenSize | "default", string][]).map(
    ([name, width]) =>
      [name, Number(width.replace("px", ""))] as [
        ScreenSize | "default",
        number
      ]
  ),
  ([_, width]) => width,
  "desc"
)
  .map(([name]) => name)
  .concat("default");

export type DynamicImageProps = {
  imageId: string;
  alt: string;
  sizes: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
  aspectRatio?: AspectRatio;
  fallbackSize: ImageSize;
  loading?: "lazy" | "eager";
  className?: string;
};

export function DynamicImage({
  imageId,
  alt,
  sizes: sizesProp,
  aspectRatio,
  fallbackSize,
  loading = "lazy",
  className,
}: DynamicImageProps) {
  const config = useConfig();

  const srcSet = IMAGE_SIZES.map((size) => {
    const url = createCloudinaryUrl(config.cloudinaryName, imageId, {
      size,
      aspectRatio,
    });

    return `${url} ${size}w`;
  }).join(",");

  const sizes = SCREEN_SIZES.reduce<string[]>((sizes, screen) => {
    const width = sizesProp[screen];

    if (width != null) {
      sizes.push(
        screen === "default"
          ? width
          : `(min-width: ${theme.screens[screen]}) ${width}`
      );
    }

    return sizes;
  }, []).join(",");

  return (
    <img
      alt={alt}
      loading={loading}
      src={createCloudinaryUrl(config.cloudinaryName, imageId, {
        size: fallbackSize,
        aspectRatio,
      })}
      srcSet={srcSet}
      sizes={sizes}
      className={cn(className, "bg-gray-100 object-cover")}
    />
  );
}

type AspectRatio = "1:1" | "4:3";

export function createCloudinaryUrl(
  cloudName: string,
  imageId: string,
  {
    size,
    aspectRatio = "4:3",
  }: {
    size: ImageSize;
    aspectRatio?: AspectRatio;
  }
) {
  const transformations = [
    `w_${size}`,
    // https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
    `ar_${aspectRatio}`,
    // https://cloudinary.com/documentation/transformation_reference#c_pad
    "c_pad",
    // https://cloudinary.com/documentation/transformation_reference#b_auto
    "b_auto",
    // https://cloudinary.com/documentation/image_optimization#automatic_quality_selection_q_auto
    "q_auto",
    // When using devtools to emulate different browsers, Cloudinary may return a
    // format that is unsupported by the main browser, so images may not display
    // as expected. For example, if using Chrome dev tools to emulate an iPhone
    // Safari browser, a JPEG-2000 may be returned, which Chrome does not support.
    // See: https://cloudinary.com/documentation/image_optimization#tips_and_considerations_for_using_f_auto
    // https://cloudinary.com/documentation/image_transformations#f_auto
    "f_auto",
  ];

  const transformationsStr = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsStr}/${imageId}`;
}

import { cn } from "#core/classNames.ts";
import { useConfig } from "#core/config.ts";
import type { IconProps } from "#generated/icon.tsx";
import { Icon } from "#generated/icon.tsx";
import type { ScreenSize } from "#generated/theme.ts";
import { theme } from "#generated/theme.ts";
import orderBy from "lodash.orderby";
import invariant from "tiny-invariant";

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;
type ImageSize = (typeof IMAGE_SIZES)[number];

export type ImageDescriptor = {
  imagesBySize: Partial<Record<ImageSize, string>>;
  alt: string;
};

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

export type StaticImageProps = {
  image: ImageDescriptor;
  sizes: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
  fallbackSize?: ImageSize;
  loading?: "lazy" | "eager";
  className?: string;
};

export function StaticImage({
  image,
  sizes: sizesProp,
  fallbackSize = IMAGE_SIZES.find((size) => image.imagesBySize[size] != null),
  loading = "lazy",
  className,
}: StaticImageProps) {
  invariant(fallbackSize != null, "At least one size should be provided.");

  const sizes = SCREEN_SIZES.reduce<string[]>((sizes, screen) => {
    const width = sizesProp[screen];

    if (width != null) {
      sizes.push(
        screen === "default"
          ? width
          : `(min-width: ${theme.screens[screen]}) ${width}`,
      );
    }

    return sizes;
  }, []).join(",");

  return (
    <img
      alt={image.alt}
      loading={loading}
      src={image.imagesBySize[fallbackSize]}
      srcSet={Object.entries(image.imagesBySize)
        .map(([size, image]) => `${image} ${size}w`)
        .join(",")}
      sizes={sizes}
      className={cn(className, "object-cover")}
    />
  );
}

type ImageBackground = "none" | "gray";

const IMAGE_BACKGROUND_CLASS_NAME: Record<ImageBackground, string> = {
  gray: "bg-gray-100",
  none: "",
};

export function DynamicImage({
  imageId,
  alt,
  sizes,
  fallbackSize,
  loading,
  background = "gray",
  className,
}: {
  imageId: string;
  alt: string;
  sizes: StaticImageProps["sizes"];
  fallbackSize: NonNullable<StaticImageProps["fallbackSize"]>;
  loading?: StaticImageProps["loading"];
  background?: ImageBackground;
  className?: string;
}) {
  const config = useConfig();
  const image: StaticImageProps["image"] = {
    alt,
    imagesBySize: Object.fromEntries(
      IMAGE_SIZES.map((size) => [
        size,
        createCloudinaryUrl(config.cloudinaryName, imageId, {
          size,
        }),
      ]),
    ),
  };

  return (
    <StaticImage
      image={image}
      fallbackSize={fallbackSize}
      sizes={sizes}
      loading={loading}
      className={cn(className, IMAGE_BACKGROUND_CLASS_NAME[background])}
    />
  );
}

export function createCloudinaryUrl(
  cloudName: string,
  imageId: string,
  {
    size,
    aspectRatio = "4:3",
  }: {
    size: ImageSize;
    aspectRatio?: "4:3" | "16:9";
  },
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

export function PlaceholderImage({
  icon,
  className,
}: {
  icon: IconProps["id"];
  className?: string;
}) {
  return (
    <div
      className={cn(className, "bg-gray-100 flex items-center justify-center")}
    >
      <Icon id={icon} height="50%" width="auto" className="text-gray-600" />
    </div>
  );
}

import orderBy from "lodash.orderby";
import invariant from "tiny-invariant";
import { cn } from "~/core/classNames";
import { ScreenSize, theme } from "~/generated/theme";

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;
type ImageSize = typeof IMAGE_SIZES[number];

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
        number
      ]
  ),
  ([_, width]) => width,
  "desc"
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
          : `(min-width: ${theme.screens[screen]}) ${width}`
      );
    }

    return sizes;
  }, []).join(",");

  return (
    // Alt text is in the rest props.
    // eslint-disable-next-line jsx-a11y/alt-text
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

import orderBy from "lodash.orderby";
import invariant from "tiny-invariant";
import { ScreenSize, theme } from "~/generated/theme";

// Ordered by decreasing size.
const imageSizes = ["2048", "1536", "1024", "512"] as const;
type ImageSize = typeof imageSizes[number];

export type ImageDescriptor = {
  imagesBySize: Partial<Record<ImageSize, string>>;
  alt: string;
};

// Larger to smaller.
const SCREEN_SIZES = orderBy(
  (Object.entries(theme.screens) as [ScreenSize | "default", string][]).map(
    (entry) =>
      [entry[0], Number(entry[1].replace("px", ""))] as [
        ScreenSize | "default",
        number
      ]
  ),
  (entry) => entry[1],
  "desc"
)
  .map((entry) => entry[0])
  .concat("default");

export type StaticImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "loading" | "src" | "srcSet" | "sizes"
> & {
  image: ImageDescriptor;
  sizes: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
};

export function StaticImage({
  image,
  sizes: sizesProp,
  ...rest
}: StaticImageProps) {
  const largestImageSize = imageSizes.find(
    (size) => image.imagesBySize[size] != null
  );

  invariant(largestImageSize != null, "At least one size should be provided.");

  return (
    // Alt text is in the rest props.
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...rest}
      alt={image.alt}
      loading="lazy"
      src={image.imagesBySize[largestImageSize]}
      srcSet={Object.entries(image.imagesBySize)
        .map(([size, image]) => `${image} ${size}w`)
        .join(",")}
      sizes={SCREEN_SIZES.reduce<string[]>((sizes, screen) => {
        const width = sizesProp[screen];

        if (width != null) {
          sizes.push(
            screen === "default"
              ? width
              : `(min-width: ${theme.screens[screen]}) ${width}`
          );
        }

        return sizes;
      }, []).join(",")}
    />
  );
}

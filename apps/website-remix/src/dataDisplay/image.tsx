import orderBy from "lodash.orderby";
import { ScreenSize, theme } from "~/generated/theme";

export type ImageResolutions = {
  512: string;
  1024: string;
  1536: string;
  2048: string;
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

export function StaticImage({
  image,
  sizes: sizesProp,
  ...rest
}: Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes"
> & {
  image: ImageResolutions;
  sizes: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
}) {
  return (
    // Alt text is in the rest props.
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      {...rest}
      src={image[2048]}
      srcSet={[
        `${image[512]} 512w`,
        `${image[1024]} 1024w`,
        `${image[1536]} 1536w`,
        `${image[2048]} 2048w`,
      ].join(",")}
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

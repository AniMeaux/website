import { blurhashToDataUri } from "@unpic/placeholder";
import orderBy from "lodash.orderby";
import { useId } from "react";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { ImageShapeId } from "~/generated/imageShapeId";
import sprite from "~/generated/imageShapesSprite.svg";
import { ScreenSize, theme } from "~/generated/theme";

type ImageSize = (typeof IMAGE_SIZES)[number];
type AspectRatio = "none" | "1:1";
type ObjectFit = "cover" | "contain";
type ImageShapeColor = "alabaster" | "mystic" | "paleBlue" | "prussianBlue";
type ImageShapeSide = "left" | "right";

export type DynamicImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "sizes"
> & {
  alt: string;
  aspectRatio?: AspectRatio;
  fallbackSize: ImageSize;
  image: {
    id: string;
    blurhash: string;
  };
  objectFit?: ObjectFit;
  shape?: {
    id: ImageShapeId;
    color: ImageShapeColor;
    side: ImageShapeSide;
  };
  sizes: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
};

export function DynamicImage({
  image,
  alt,
  sizes: sizesProp,
  aspectRatio = "1:1",
  objectFit = "contain",
  shape,
  fallbackSize,
  loading = "lazy",
  className,
  style: styleProp,
  ...rest
}: DynamicImageProps) {
  const config = useConfig();

  const srcSet = IMAGE_SIZES.map((size) => {
    const url = createCloudinaryUrl(config.cloudinaryName, image.id, {
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

  const imageShapeInstanceId = `image-shape-${useId()}`;
  const style = styleProp ?? {};
  style.backgroundImage = `url(${blurhashToDataUri(image.blurhash, 8, 8)})`;
  if (shape != null) {
    style.clipPath = `url(#${imageShapeInstanceId})`;
  }

  return (
    <>
      <img
        {...rest}
        alt={alt}
        loading={loading}
        src={createCloudinaryUrl(config.cloudinaryName, image.id, {
          size: fallbackSize,
          aspectRatio,
        })}
        srcSet={srcSet}
        sizes={sizes}
        className={cn(
          "bg-cover",
          ASPECT_RATIO_CLASS_NAME[aspectRatio],
          OBJECT_FIT_CLASS_NAME[objectFit],
          className
        )}
        style={style}
      />

      {shape != null ? (
        <svg
          stroke="none"
          viewBox="0 0 1 1"
          className={cn(
            "absolute -z-10 top-0 left-0 -translate-y-1 md:-translate-y-2 w-full aspect-square transition-transform ease-in-out duration-100",
            IMAGE_SHAPE_COLOR_CLASS_NAME[shape.color],
            IMAGE_SHAPE_SIDE_CLASS_NAME[shape.side]
          )}
        >
          <defs>
            <clipPath
              id={imageShapeInstanceId}
              clipPathUnits="objectBoundingBox"
            >
              <use href={`${sprite}#${shape.id}`} />
            </clipPath>
          </defs>

          <use href={`${sprite}#${shape.id}`} />
        </svg>
      ) : null}
    </>
  );
}

export function createCloudinaryUrl(
  cloudName: string,
  imageId: string,
  {
    aspectRatio = "none",
    format = "auto",
    size,
  }: {
    aspectRatio?: AspectRatio;
    format?: "auto" | "jpg";
    size?: ImageSize;
  }
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
      "c_fill"
    );
  }

  const transformationsStr = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsStr}/${imageId}`;
}

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;

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

const ASPECT_RATIO_CLASS_NAME: Record<AspectRatio, string> = {
  "1:1": "aspect-square",
  none: "",
};

const OBJECT_FIT_CLASS_NAME: Record<ObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
};

const IMAGE_SHAPE_COLOR_CLASS_NAME: Record<ImageShapeColor, string> = {
  alabaster: "fill-alabaster",
  mystic: "fill-mystic",
  paleBlue: "fill-paleBlue",
  prussianBlue: "fill-prussianBlue",
};

const IMAGE_SHAPE_SIDE_CLASS_NAME: Record<ImageShapeSide, string> = {
  left: "-translate-x-1 md:-translate-x-2 -rotate-12",
  right: "translate-x-1 md:translate-x-2 rotate-12",
};

import { blurhashToImageCssObject } from "@unpic/placeholder";
import orderBy from "lodash.orderby";
import { cn } from "~/core/classNames";
import { useConfig } from "~/core/config";
import { generateId } from "~/core/id";
import { ScreenSize, theme } from "~/generated/theme";

// Ordered by decreasing size.
const IMAGE_SIZES = ["2048", "1536", "1024", "512", "256", "128"] as const;
type ImageSize = (typeof IMAGE_SIZES)[number];

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

type AspectRatio = "none" | "1:1" | "4:3";

const ASPECT_RATIO_CLASS_NAME: Record<AspectRatio, string> = {
  "1:1": "aspect-square",
  "4:3": "aspect-4/3",
  none: "",
};

type ImageBackground = "none" | "gray";

const IMAGE_BACKGROUND_CLASS_NAME: Record<ImageBackground, string> = {
  gray: "bg-gray-100",
  none: "",
};

type ObjectFit = "cover" | "contain";

const OBJECT_FIT_CLASS_NAME: Record<ObjectFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
};

type CommonImageProps = {
  alt: string;
  aspectRatio?: AspectRatio;
  background?: ImageBackground;
  className?: string;
  loading?: "lazy" | "eager";
  objectFit?: ObjectFit;
  style?: React.CSSProperties;
};

export type DynamicImageProps = CommonImageProps & {
  fallbackSize: ImageSize;
  imageId: string;
  sizes: Partial<Record<ScreenSize, string>> & {
    // `default` is mandatory.
    default: string;
  };
};

export function DynamicImage({
  imageId,
  alt,
  sizes: sizesProp,
  aspectRatio = "4:3",
  objectFit = "contain",
  background = "gray",
  fallbackSize,
  loading = "lazy",
  className,
  style,
}: DynamicImageProps) {
  const imageUrl = new URL(imageId, "https://fake.host");
  const hash = imageUrl.searchParams.get("hash");
  if (hash != null) {
    style = { ...style, ...blurhashToImageCssObject(hash, 80, 80) };
  }

  const { cloudinaryName } = useConfig();

  const srcSet = IMAGE_SIZES.map((size) => {
    const url = createCloudinaryUrl(cloudinaryName, imageUrl.pathname, {
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
      src={createCloudinaryUrl(cloudinaryName, imageUrl.pathname, {
        size: fallbackSize,
        aspectRatio,
      })}
      srcSet={srcSet}
      sizes={sizes}
      className={cn(
        className,
        ASPECT_RATIO_CLASS_NAME[aspectRatio],
        IMAGE_BACKGROUND_CLASS_NAME[background],
        OBJECT_FIT_CLASS_NAME[objectFit]
      )}
      // style={{
      //   backgroundImage:
      //     "url(data:image/bmp;base64,Qk1aBAAAAAAAADYAAAAoAAAABAAAAAMAAAABABgAAAAAACQAAAATCwAAEwsAAAAAAAAAAAAAxtbS8O7s0cvMaXeGprfB09HasazCJkaNVnugipO2g5HEAEqg)",
      //   backgroundSize: "cover",
      //   ...style,
      // }}
      style={style}
    />
  );
}

export function createCloudinaryUrl(
  cloudName: string,
  imageId: string,
  {
    aspectRatio,
    format = "auto",
    size,
  }: {
    aspectRatio: AspectRatio;
    format?: "auto" | "jpg";
    size?: ImageSize;
  }
) {
  // Remove leading "/" when using URL#pathname.
  imageId = imageId.replace(/^\//, "");

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
      // https://cloudinary.com/documentation/transformation_reference#c_pad
      "c_pad",
      // https://cloudinary.com/documentation/transformation_reference#b_auto
      "b_auto"
    );
  }

  const transformationsStr = transformations.join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationsStr}/${imageId}`;
}

export type ImageFile = {
  dataUrl: string;
  file: File;
  id: string;
};

export type ImageFileOrId = string | ImageFile;

export function isImageFile(image: ImageFileOrId): image is ImageFile {
  return typeof image !== "string";
}

export function getImageId(image: ImageFileOrId) {
  return isImageFile(image) ? image.id : image;
}

export function DataUrlOrDynamicImage({
  alt,
  aspectRatio = "4:3",
  background = "gray",
  className,
  fallbackSize,
  image,
  loading = "lazy",
  objectFit = "contain",
  sizes,
  style,
}: Omit<DataUrlImageProps, "imageFile"> &
  Omit<DynamicImageProps, "imageId"> & {
    image: ImageFileOrId;
  }) {
  if (isImageFile(image)) {
    return (
      <DataUrlImage
        alt={alt}
        aspectRatio={aspectRatio}
        background={background}
        className={className}
        imageFile={image}
        loading={loading}
        objectFit={objectFit}
        style={style}
      />
    );
  }

  return (
    <DynamicImage
      alt={alt}
      aspectRatio={aspectRatio}
      background={background}
      className={className}
      fallbackSize={fallbackSize}
      imageId={image}
      loading={loading}
      objectFit={objectFit}
      sizes={sizes}
      style={style}
    />
  );
}

type DataUrlImageProps = CommonImageProps & {
  imageFile: ImageFile;
};

function DataUrlImage({
  alt,
  aspectRatio = "4:3",
  background = "gray",
  className,
  imageFile,
  loading = "lazy",
  objectFit = "contain",
  style,
}: DataUrlImageProps) {
  return (
    <img
      alt={alt}
      loading={loading}
      src={imageFile.dataUrl}
      className={cn(
        className,
        ASPECT_RATIO_CLASS_NAME[aspectRatio],
        IMAGE_BACKGROUND_CLASS_NAME[background],
        OBJECT_FIT_CLASS_NAME[objectFit]
      )}
      style={style}
    />
  );
}

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
      const dataUrl = loadEvent.target!.result as string;
      const id = generateId();
      return resolve({ dataUrl, file, id });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

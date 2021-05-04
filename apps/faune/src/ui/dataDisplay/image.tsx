import { ImageFileOrId, isImageFile } from "@animeaux/shared-entities";
import * as Sentry from "@sentry/react";
import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";
import invariant from "invariant";
import * as React from "react";
import { FaImage } from "react-icons/fa";

export type ImagePreset = "avatar" | "none";

export type ImageProviderContextValue<ImageProviderType> = {
  imageProvider: ImageProviderType;
  getImageUrl: (imageId: string, preset?: ImagePreset) => string;
};

const ImageProviderContext = React.createContext<ImageProviderContextValue<any> | null>(
  null
);

type ImageProviderContextProviderProps<ImageProviderType> = ChildrenProp & {
  createImageProvider: () => ImageProviderType;
  getImageUrl: (
    imageProvider: ImageProviderType,
    imageId: string,
    preset: ImagePreset
  ) => string;
};

export function ImageProviderContextProvider<ImageProviderType>({
  children,
  createImageProvider,
  getImageUrl,
}: ImageProviderContextProviderProps<ImageProviderType>) {
  const imageProvider = React.useMemo(createImageProvider, [
    createImageProvider,
  ]);

  const value = React.useMemo<ImageProviderContextValue<ImageProviderType>>(
    () => ({
      imageProvider,
      getImageUrl: (imageId, preset = "none") =>
        getImageUrl(imageProvider, imageId, preset),
    }),
    [imageProvider, getImageUrl]
  );

  return (
    <ImageProviderContext.Provider value={value}>
      {children}
    </ImageProviderContext.Provider>
  );
}

export function useImageProvider<ImageProviderType = any>() {
  const context = React.useContext(ImageProviderContext);

  invariant(
    context != null,
    "useImageProvider should not be used outside of a ImageProviderContextProvider."
  );

  return context as ImageProviderContextValue<ImageProviderType>;
}

export type ImageProps = StyleProps & {
  image: ImageFileOrId;
  alt: string;
  preset?: ImagePreset;
};

export function Image({
  image,
  preset = "none",
  alt,
  className,
  ...rest
}: ImageProps) {
  const { getImageUrl } = useImageProvider();
  const src = isImageFile(image) ? image.dataUrl : getImageUrl(image, preset);
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <span
        {...rest}
        title={alt}
        className={cn(
          "bg-gray-100 flex items-center justify-center text-black text-opacity-40",
          className
        )}
      >
        <FaImage />
      </span>
    );
  }

  return (
    <img
      {...rest}
      className={className}
      src={src}
      alt={alt}
      onError={(error) => {
        Sentry.captureException(error, {
          extra: { image, preset, src },
        });

        setHasError(true);
      }}
    />
  );
}

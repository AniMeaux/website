import { ImageFileOrId, isImageFile } from "@animeaux/shared-entities";
import invariant from "invariant";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

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

export function Image({ image, preset = "none", alt, ...rest }: ImageProps) {
  const { getImageUrl } = useImageProvider();
  const src = isImageFile(image) ? image.dataUrl : getImageUrl(image, preset);
  return <img {...rest} src={src} alt={alt} />;
}

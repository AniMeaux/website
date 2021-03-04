export type ImageFile = {
  id: string;
  file: File;
  dataUrl: string;
};

export type ImageFileOrId = string | ImageFile;

export function isImageFile(image: ImageFileOrId): image is ImageFile {
  return typeof image !== "string";
}

export function getImageId(image: ImageFileOrId) {
  return isImageFile(image) ? image.id : image;
}

export type CloudinaryApiSignature = {
  // Use a string as it can be non 32-bit signed integer.
  timestamp: string;
  signature: string;
};

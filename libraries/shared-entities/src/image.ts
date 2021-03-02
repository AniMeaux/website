export type ImageFile = {
  id: string;
  file: File;
  dataUrl: string;
};

export function isImageFile(image: string | ImageFile): image is ImageFile {
  return typeof image !== "string";
}

export function getImageId(image: string | ImageFile) {
  return isImageFile(image) ? image.id : image;
}

export type CloudinaryApiSignature = {
  // Use a string as it can be non 32-bit signed integer.
  timestamp: string;
  signature: string;
};

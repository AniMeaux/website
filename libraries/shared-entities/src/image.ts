export type ImageFile = {
  id: string;
  file: File;
  dataUrl: string;
};

export type CloudinaryApiSignature = {
  // Use a string as it can be non 32-bit signed integer.
  timestamp: string;
  signature: string;
};

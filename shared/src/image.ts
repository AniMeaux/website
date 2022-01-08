export type CloudinaryApiSignature = {
  // Use a string as it can be non 32-bit signed integer.
  timestamp: string;
  signature: string;
};

export type ImageOperations = {
  getCloudinaryApiSignature: (params: {
    parametersToSign: { id: string; tags?: string };
  }) => CloudinaryApiSignature;
};

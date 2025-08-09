export namespace ImageLimits {
  // Cloudinary default value (20 MB).
  // https://support.cloudinary.com/hc/en-us/articles/202520592-Do-you-have-a-file-size-limit
  const CLOUDINARY_MAX_SIZE_MB = 20;

  export const MAX_SIZE_MB = CLOUDINARY_MAX_SIZE_MB;
  export const MAX_SIZE_B = MAX_SIZE_MB * 1_000_000;
}

// Cloudinary default value (20 MB).
// https://support.cloudinary.com/hc/en-us/articles/202520592-Do-you-have-a-file-size-limit
const CLOUDINARY_IMAGE_SIZE_LIMIT_MB = 20;

export const IMAGE_SIZE_LIMIT_MB = CLOUDINARY_IMAGE_SIZE_LIMIT_MB;

export const IMAGE_SIZE_LIMIT_B = IMAGE_SIZE_LIMIT_MB * 1_000_000;

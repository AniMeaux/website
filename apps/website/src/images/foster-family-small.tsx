import type { ImageDescriptor } from "#i/core/data-display/image";
import fosterFamilySmall1024 from "#i/images/foster-family-small-1024w.png";
import fosterFamilySmall512 from "#i/images/foster-family-small-512w.png";

export const fosterFamilySmallImages: ImageDescriptor = {
  alt: "Homme portant un chat dans les bras.",
  imagesBySize: {
    "512": fosterFamilySmall512,
    "1024": fosterFamilySmall1024,
  },
};

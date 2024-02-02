import type { ImageDescriptor } from "#core/data-display/image";
import fosterFamilyLarge1024 from "#images/foster-family-large-1024w.png";
import fosterFamilyLarge1536 from "#images/foster-family-large-1536w.png";
import fosterFamilyLarge2048 from "#images/foster-family-large-2048w.png";
import fosterFamilyLarge512 from "#images/foster-family-large-512w.png";

export const fosterFamilyLargeImages: ImageDescriptor = {
  alt: "Homme portant un chat dans les bras.",
  imagesBySize: {
    "512": fosterFamilyLarge512,
    "1024": fosterFamilyLarge1024,
    "1536": fosterFamilyLarge1536,
    "2048": fosterFamilyLarge2048,
  },
};

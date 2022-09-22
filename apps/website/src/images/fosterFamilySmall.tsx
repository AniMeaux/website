import { ImageDescriptor } from "~/dataDisplay/image";
import fosterFamilySmall1024 from "~/images/fosterFamilySmall-1024w.png";
import fosterFamilySmall512 from "~/images/fosterFamilySmall-512w.png";

export const fosterFamilySmallImages: ImageDescriptor = {
  alt: "Homme portant un chat dans les bras.",
  imagesBySize: {
    "512": fosterFamilySmall512,
    "1024": fosterFamilySmall1024,
  },
};

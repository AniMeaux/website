import type { ImageDescriptor } from "#i/core/data-display/image";
import pickUp512 from "#i/images/pick-up-512w.png";
import pickUp1024 from "#i/images/pick-up-1024w.png";

export const pickUpImages: ImageDescriptor = {
  alt: "Chat qui regarde à travers une grille.",
  imagesBySize: {
    "512": pickUp512,
    "1024": pickUp1024,
  },
};

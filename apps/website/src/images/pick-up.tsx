import type { ImageDescriptor } from "#core/data-display/image";
import pickUp1024 from "#images/pick-up-1024w.png";
import pickUp512 from "#images/pick-up-512w.png";

export const pickUpImages: ImageDescriptor = {
  alt: "Chat qui regarde à travers une grille.",
  imagesBySize: {
    "512": pickUp512,
    "1024": pickUp1024,
  },
};

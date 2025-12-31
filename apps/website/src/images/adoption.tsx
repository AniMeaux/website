import type { ImageDescriptor } from "#i/core/data-display/image";
import adoption1024 from "#i/images/adoption-1024w.png";
import adoption512 from "#i/images/adoption-512w.png";

export const adoptionImages: ImageDescriptor = {
  alt: "Chat escaladant une petite grille.",
  imagesBySize: {
    "512": adoption512,
    "1024": adoption1024,
  },
};

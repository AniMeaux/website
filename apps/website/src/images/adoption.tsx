import { ImageDescriptor } from "#core/dataDisplay/image.tsx";
import adoption1024 from "#images/adoption-1024w.png";
import adoption512 from "#images/adoption-512w.png";

export const adoptionImages: ImageDescriptor = {
  alt: "Chat escaladant une petite grille.",
  imagesBySize: {
    "512": adoption512,
    "1024": adoption1024,
  },
};

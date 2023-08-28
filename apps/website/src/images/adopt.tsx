import type { ImageDescriptor } from "#core/dataDisplay/image.tsx";
import adopt1024 from "#images/adopt-1024w.png";
import adopt1536 from "#images/adopt-1536w.png";
import adopt2048 from "#images/adopt-2048w.png";
import adopt512 from "#images/adopt-512w.png";

export const adoptImages: ImageDescriptor = {
  alt: "Chat escaladant une petite grille.",
  imagesBySize: {
    "512": adopt512,
    "1024": adopt1024,
    "1536": adopt1536,
    "2048": adopt2048,
  },
};

import type { ImageDescriptor } from "#i/core/data-display/image";
import equipment1024 from "#i/images/equipment-1024w.png";
import equipment1536 from "#i/images/equipment-1536w.png";
import equipment2048 from "#i/images/equipment-2048w.png";
import equipment512 from "#i/images/equipment-512w.png";

export const equipmentImages: ImageDescriptor = {
  alt: "Deux cochons d’indes mangeant de la carotte.",
  imagesBySize: {
    "512": equipment512,
    "1024": equipment1024,
    "1536": equipment1536,
    "2048": equipment2048,
  },
};

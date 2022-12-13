import { ImageDescriptor } from "#/dataDisplay/image";
import map1024 from "#/images/map-1024w.png";
import map1536 from "#/images/map-1536w.png";
import map2048 from "#/images/map-2048w.png";
import map512 from "#/images/map-512w.png";

export const mapImages: ImageDescriptor = {
  alt: "Carte de Meaux.",
  imagesBySize: {
    "512": map512,
    "1024": map1024,
    "1536": map1536,
    "2048": map2048,
  },
};

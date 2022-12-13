import { ImageDescriptor } from "#/dataDisplay/image";
import association1024 from "#/images/association-1024w.png";
import association512 from "#/images/association-512w.png";

export const associationImages: ImageDescriptor = {
  alt: "Chat regardant à travers une grille.",
  imagesBySize: {
    "512": association512,
    "1024": association1024,
  },
};

import { ImageDescriptor } from "#/dataDisplay/image";
import medical1024 from "#/images/medical-1024w.png";
import medical512 from "#/images/medical-512w.png";

export const medicalImages: ImageDescriptor = {
  alt: "Chien avec une seringue dans la bouche.",
  imagesBySize: {
    "512": medical512,
    "1024": medical1024,
  },
};

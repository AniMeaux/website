import { ImageDescriptor } from "~/dataDisplay/image";
import carpool1024 from "~/images/carpool-1024w.png";
import carpool1536 from "~/images/carpool-1536w.png";
import carpool2048 from "~/images/carpool-2048w.png";
import carpool512 from "~/images/carpool-512w.png";

export const carpoolImages: ImageDescriptor = {
  alt: "Chien dans une voiture.",
  imagesBySize: {
    "512": carpool1024,
    "1024": carpool1536,
    "1536": carpool2048,
    "2048": carpool512,
  },
};

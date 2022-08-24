import { ImageDescriptor } from "~/dataDisplay/image";
import adoption1024 from "~/images/adoption-1024w.png";
import adoption512 from "~/images/adoption-512w.png";

export const adoptionImages: ImageDescriptor = {
  alt: "Miss de beautée tenant un chien dans les bras",
  imagesBySize: {
    "512": adoption512,
    "1024": adoption1024,
  },
};

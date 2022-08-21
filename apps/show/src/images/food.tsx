import { ImageDescriptor } from "~/dataDisplay/image";
import food1024 from "~/images/food-1024w.png";
import food512 from "~/images/food-512w.png";

export const foodImages: ImageDescriptor = {
  alt: "Deux cochons d'inde mangeant une brindille",
  imagesBySize: {
    "512": food512,
    "1024": food1024,
  },
};

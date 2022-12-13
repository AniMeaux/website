import { ImageDescriptor } from "#/dataDisplay/image";
import show1024 from "#/images/show-1024w.png";
import show1536 from "#/images/show-1536w.png";
import show2048 from "#/images/show-2048w.png";
import show512 from "#/images/show-512w.png";

export const showImages: ImageDescriptor = {
  alt: "Chat allongé touchant la truffe d’un chien avec sa patte.",
  imagesBySize: {
    "512": show512,
    "1024": show1024,
    "1536": show1536,
    "2048": show2048,
  },
};

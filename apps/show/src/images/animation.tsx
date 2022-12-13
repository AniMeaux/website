import { ImageDescriptor } from "#/dataDisplay/image";
import animation1024 from "#/images/animation-1024w.png";
import animation512 from "#/images/animation-512w.png";

export const animationImages: ImageDescriptor = {
  alt: "Chiot tenu en laisse sur une estrade.",
  imagesBySize: {
    "512": animation512,
    "1024": animation1024,
  },
};

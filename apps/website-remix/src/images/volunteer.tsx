import { ImageDescriptor } from "~/dataDisplay/image";
import volunteer1024 from "~/images/volunteer-1024w.png";
import volunteer1536 from "~/images/volunteer-1536w.png";
import volunteer2048 from "~/images/volunteer-2048w.png";
import volunteer512 from "~/images/volunteer-512w.png";

export const volunteerImages: ImageDescriptor = {
  alt: "Deux volontaires de dos avec des t-shirts Ani’Meaux.",
  imagesBySize: {
    "512": volunteer512,
    "1024": volunteer1024,
    "1536": volunteer1536,
    "2048": volunteer2048,
  },
};
